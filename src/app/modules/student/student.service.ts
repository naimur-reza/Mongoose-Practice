import mongoose from 'mongoose';
import { Student } from './student.model';
import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';
import { TStudent } from './student.interface';
import { updateStudentValidationSchema } from './student.validation';
const getAllStudentsFromDB = async () => {
  const result = await Student.find()
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findById({ _id: id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    const deletedStudent = await Student.updateOne(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent)
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student!');

    await session.commitTransaction();
    session.endSession();
    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error('Failed to delete student');
  }
};

const updateStudentFromDB = async (
  id: string,
  updateData: Partial<TStudent>,
) => {
  updateStudentValidationSchema.parse(updateData);

  const isStudentExist = await Student.findOne({ id });
  if (!isStudentExist)
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found!');

  const updatedStudent = await Student.findOneAndUpdate({ id }, updateData, {
    new: true,
    runValidators: true,
  });

  return updatedStudent;
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentFromDB,
};
