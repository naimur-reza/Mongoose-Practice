/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { AppError } from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { User } from '../user/user.model';
import EnrolledCourse from './enrolledCourse.model';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';

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
  const semesterRegistration = await SemesterRegistration.findOne({
    academicSemester: offeredCourse.academicSemester,
  }).select('maxCredit');

  if (!semesterRegistration) {
    throw new AppError(404, 'Semester registration does not exist');
  }

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

  //
  const totalCredits =
    enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;
  console.log(totalCredits);

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

  // const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
  //   semesterRegistration: offeredCourse.semesterRegistration,
  //   offeredCourse: payload.offeredCourse,
  //   student: user._id,
  // });

  // if (isStudentAlreadyEnrolled) {
  //   throw new AppError(400, 'You are already enrolled in this course');
  // }

  // const session = await mongoose.startSession();

  // try {
  //   session.startTransaction();

  //   const {
  //     semesterRegistration,
  //     academicSemester,
  //     academicFaculty,
  //     academicDepartment,
  //     course,
  //     faculty,
  //   } = offeredCourse;

  //   const enrolledCourse = await EnrolledCourse.create(
  //     [
  //       {
  //         semesterRegistration,
  //         academicSemester,
  //         academicFaculty,
  //         academicDepartment,
  //         offeredCourse,
  //         course,
  //         student: user._id,
  //         faculty,
  //       },
  //     ],
  //     { session },
  //   );

  //   const maxCapacity = offeredCourse.maxCapacity - 1;

  //   await OfferedCourse.findByIdAndUpdate(id, { maxCapacity }, { session });

  //   await session.commitTransaction();
  //   await session.endSession();

  //   return enrolledCourse;
  // } catch (error: any) {
  //   await session.abortTransaction();
  //   await session.endSession();
  //   throw new Error(error);
  // }
};

const updateEnrolledCourseMarksIntoDB = async (facultyId, data) => {};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
};
