/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { AppError } from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { User } from '../user/user.model';
import EnrolledCourse from './enrolledCourse.model';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Course } from '../Course/course.model';
import { Faculty } from '../Faculty/faculty.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { Student } from '../student/student.model';
import { calculateGradeAndPoints } from './enrolledCourse.utils';
import QueryBuilder from '../../builder/queryBuilder';
import httpStatus from 'http-status';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: {
    offeredCourse: string;
  },
) => {
  /**
   * step 1: check if the offered course exists in the database
   * step 2: check if the user is already enrolled in the course
   * step 3: create an enrolled course in the database
   */

  const { offeredCourse: id } = payload;

  const offeredCourse = await OfferedCourse.findById(id);

  if (!offeredCourse) {
    throw new AppError(404, 'Offered course does not exist');
  }

  const course = await Course.findById(offeredCourse.course);

  if (!course) {
    throw new AppError(404, 'Course does not exist');
  }

  const semesterRegistration = await SemesterRegistration.findOne({
    academicSemester: offeredCourse.academicSemester,
  }).select('maxCredit');

  if (!semesterRegistration) {
    throw new AppError(404, 'Semester registration does not exist');
  }

  // find out the total credits of the enrolled courses of the student

  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: semesterRegistration._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCoursesData',
      },
    },
    {
      $unwind: '$enrolledCoursesData',
    },

    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCoursesData.credits' },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  const totalCredits =
    enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;

  // check if the user has exceeded the maximum credit limit

  if (
    totalCredits &&
    totalCredits + course.credits > semesterRegistration.maxCredit
  )
    throw new AppError(400, 'You have exceeded the maximum credit limit');

  if (offeredCourse.maxCapacity <= 0)
    throw new AppError(400, 'Course is already full');

  const user = await User.findOne(
    { id: userId },
    {
      _id: 1,
    },
  );

  if (!user) {
    throw new AppError(404, 'User does not exist');
  }

  // check if the user is already enrolled in the course

  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: offeredCourse.semesterRegistration,
    offeredCourse: payload.offeredCourse,
    student: user._id,
  });

  if (isStudentAlreadyEnrolled) {
    throw new AppError(400, 'You are already enrolled in this course');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      semesterRegistration,
      academicSemester,
      academicFaculty,
      academicDepartment,
      course,
      faculty,
    } = offeredCourse;

    const enrolledCourse = await EnrolledCourse.create(
      [
        {
          semesterRegistration,
          academicSemester,
          academicFaculty,
          academicDepartment,
          offeredCourse,
          course,
          student: user._id,
          faculty,
        },
      ],
      { session },
    );

    const maxCapacity = offeredCourse.maxCapacity - 1;

    await OfferedCourse.findByIdAndUpdate(id, { maxCapacity }, { session });

    await session.commitTransaction();
    await session.endSession();

    return enrolledCourse;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  data: Partial<TEnrolledCourse>,
) => {
  // validations here
  const faculty = await Faculty.findOne({ id: facultyId });
  if (!faculty) throw new AppError(404, 'Faculty does not exist');

  const { student, semesterRegistration, offeredCourse, courseMarks } = data;

  const studentInfo = await Student.findById(student);
  if (!studentInfo) throw new AppError(404, 'Student does not exist');

  const semesterRegistrationInfo =
    await SemesterRegistration.findById(semesterRegistration);
  if (!semesterRegistrationInfo)
    throw new AppError(404, 'Semester registration does not exist');

  const offeredCourseInfo = await OfferedCourse.findById(offeredCourse);
  if (!offeredCourseInfo)
    throw new AppError(404, 'Offered course does not exist');
  console.log(data);

  const isCourseBelongsToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    faculty: faculty._id,
  });
  if (!isCourseBelongsToFaculty)
    throw new AppError(400, 'Course does not belong to the faculty');

  //  update logics here

  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  };

  if (courseMarks?.finalTerm) {
    const totalMarks = Math.ceil(
      courseMarks.classTest1 * 0.1 +
        courseMarks.classTest2 * 0.1 +
        courseMarks.midTerm * 0.3 +
        courseMarks.finalTerm * 0.5,
    );

    const gradeAndPoints = calculateGradeAndPoints(totalMarks);
    modifiedData.grade = gradeAndPoints.grade;
    modifiedData.gradePoints = gradeAndPoints.gradePoints;
    modifiedData.isCompleted = true;
  }

  if (courseMarks && Object.keys(courseMarks).length > 0) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  const enrolledCourse = await EnrolledCourse.findOneAndUpdate(
    {
      student,
      semesterRegistration,
      offeredCourse,
    },

    modifiedData,
    {
      new: true,
    },
  );

  if (!enrolledCourse)
    throw new AppError(404, 'Enrolled course does not exist');

  return enrolledCourse;
};

const getMyEnrolledCoursesFromDB = async (
  studentId: string,
  query: Record<string, unknown>,
) => {
  const student = await Student.findOne({ id: studentId });

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found !');
  }

  const enrolledCourseQuery = new QueryBuilder(
    EnrolledCourse.find({ student: student._id }).populate(
      'semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty',
    ),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await enrolledCourseQuery.modelQuery;
  const meta = await enrolledCourseQuery.countTotal();

  return {
    meta,
    result,
  };
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
  getMyEnrolledCoursesFromDB,
};
