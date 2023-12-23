import mongoose from 'mongoose';
import { AppError } from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { User } from '../user/user.model';
import EnrolledCourse from './enrolledCourse.model';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: {
    offeredCourse: string;
  },
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
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

    if (offeredCourse.maxCapacity <= 0)
      throw new AppError(400, 'Course is already full');

    const user = await User.findOne({ id: userId }).select('_id');

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
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const updateEnrolledCourseMarksIntoDB = async (facultyId, data) => {};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
};
