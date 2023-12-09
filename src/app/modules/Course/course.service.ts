import QueryBuilder from '../../builder/queryBuilder';
import { CourseSearchableFields } from './course.constant';
import { ICourse } from './course.interface';
import { Course } from './course.model';

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

const updateCourseFromDB = async (id: string, courseData: ICourse) => {
  const { preRequisiteCourses, ...remainingData } = courseData;
  await Course.findByIdAndUpdate(id, remainingData, {
    new: true,
    runValidators: true,
  });

  if (preRequisiteCourses && preRequisiteCourses.length > 0) {
    const deletedPreRequisites = preRequisiteCourses
      .filter((course) => course.isDeleted !== false)
      .map((el) => el.course);

    await Course.findByIdAndUpdate(id, {
      $pull: {
        preRequisiteCourses: {
          course: {
            $in: deletedPreRequisites,
          },
        },
      },
    });

    const addPreRequisitesCourse = preRequisiteCourses.filter(
      (el) => el.course && !el.isDeleted,
    );

    await Course.findByIdAndUpdate(id, {
      $addToSet: {
        preRequisiteCourses: {
          $each: addPreRequisitesCourse,
        },
      },
    });
  }

  const result = Course.findById(id).populate('preRequisiteCourses.course');

  return result;
};

export const CourseService = {
  createCourse,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseFromDB,
  deleteCourseFromDB,
};
