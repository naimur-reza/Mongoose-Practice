import mongoose from 'mongoose';
import QueryBuilder from '../../builder/queryBuilder';
import { CourseSearchableFields } from './course.constant';
import { ICourse, ICourseFaculties } from './course.interface';
import { Course, CourseFaculty } from './course.model';
import { AppError } from '../../errors/AppError';

const createCourse = async (payload: ICourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find({}).populate('preRequisiteCourses.course'),
    query,
  )
    .search(CourseSearchableFields)
    .fields()
    .filter()
    .paginate()
    .sort();
  const result = await courseQuery.modelQuery;
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById({ _id: id }).populate(
    'preRequisiteCourses.course',
  );
  return result;
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    { new: true },
  );

  return result;
};

const updateCourseFromDB = async (id: string, courseData: Partial<ICourse>) => {
  const session = await mongoose.startSession();

  await session.startTransaction();
  try {
    const { preRequisiteCourses, ...remainingData } = courseData;
    await Course.findByIdAndUpdate(id, remainingData, {
      new: true,
      runValidators: true,
      session,
    });

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletedPreRequisites = preRequisiteCourses
        .filter((course) => course.isDeleted !== false)
        .map((el) => el.course);

      const deletedPreRequisitesCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: {
              course: {
                $in: deletedPreRequisites,
              },
            },
          },
        },
        {
          session,
        },
      );

      if (!deletedPreRequisitesCourses)
        throw new AppError(500, 'Delete course failed!');

      const addPreRequisitesCourse = preRequisiteCourses.filter(
        (el) => el.course && !el.isDeleted,
      );

      const newPreRequites = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            preRequisiteCourses: {
              $each: addPreRequisitesCourse,
            },
          },
        },
        {
          session,
          runValidators: true,
        },
      );
      if (!newPreRequites)
        throw new AppError(500, 'PreRequisiteCourses course add failed ');
    }
    const result = Course.findById(id).populate('preRequisiteCourses.course');

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(500, 'Update failed!');
  }
};

const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<ICourseFaculties>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload.faculties } },
    },
    {
      upsert: true,
      new: true,
    },
  );
  return result;
};

const removeFacultiesFromDB = async (
  id: string,
  payload: Partial<ICourseFaculties>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload.faculties } },
    },
    {
      new: true,
    },
  );
  return result;
};

export const CourseService = {
  createCourse,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseFromDB,
  deleteCourseFromDB,
  assignFacultiesWithCourseIntoDB,
  removeFacultiesFromDB,
};
