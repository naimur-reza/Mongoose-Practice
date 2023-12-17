// import mongoose from 'mongoose';
import QueryBuilder from '../../builder/queryBuilder';
import { AppError } from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { ISemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';

const createSemesterRegistrationIntoDB = async (
  payload: ISemesterRegistration,
) => {
  // check if there any upcoming or ongoing semester

  const isExistUpcomingOrOngoingSemester = await SemesterRegistration.findOne({
    $or: [{ status: 'ONGOING' }, { status: 'UPCOMING' }],
  });

  if (isExistUpcomingOrOngoingSemester)
    throw new AppError(
      500,
      `There is already an ${isExistUpcomingOrOngoingSemester.status} semester`,
    );

  const academicSemester = payload.academicSemester;

  // check if the academicSemester exist

  const isAcademicSemesterExist =
    await AcademicSemester.findById(academicSemester);
  if (!isAcademicSemesterExist)
    throw new AppError(404, 'Academic semester not found!');

  // check if semester already registered

  const isRegisteredSemester = await SemesterRegistration.findOne({
    academicSemester,
  });
  if (isRegisteredSemester)
    throw new AppError(201, 'Semester already registered!');

  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationFromDB = async (
  query: ISemesterRegistration,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .paginate()
    .sort()
    .fields();
  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result =
    await SemesterRegistration.findById(id).populate('academicSemester');
  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: ISemesterRegistration,
) => {
  const requestedStatus = payload.status;

  const isExistTheSemester = await SemesterRegistration.findById(id);

  if (!isExistTheSemester) throw new AppError(404, 'Semester is not exist');

  // check if the semester status ended or not

  const currentSemesterStatus = isExistTheSemester.status;

  if (currentSemesterStatus === 'ENDED')
    throw new AppError(500, `Can not update ${currentSemesterStatus} semester`);

  //  ONGOING -> UPCOMING -> ENDED

  if (currentSemesterStatus === 'ONGOING' && requestedStatus === 'UPCOMING')
    throw new AppError(
      400,
      `You can not change the status from ${currentSemesterStatus} to ${requestedStatus}`,
    );

  if (currentSemesterStatus === 'UPCOMING' && requestedStatus === 'ENDED')
    throw new AppError(
      400,
      `You can not change the status from ${currentSemesterStatus} to ${requestedStatus}`,
    );

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteSemesterRegistrationFromDB = async (id: string) => {
  // const session = await mongoose.startSession();

  // try {
  // session.startTransaction();

  const semesterRegistration = await SemesterRegistration.findById(id);

  if (!semesterRegistration)
    throw new AppError(404, 'Semester registration not found');

  if (semesterRegistration.status !== 'UPCOMING')
    throw new AppError(
      400,
      `Can not delete ${semesterRegistration.status} semester`,
    );

  console.log(id);
  const deleteSemesterRegistration =
    await SemesterRegistration.findByIdAndDelete(
      id,
      // { session },
    );

  if (!deleteSemesterRegistration)
    throw new AppError(500, 'Semester registration delete failed!');

  const deleteOfferedCourse = await OfferedCourse.findOneAndDelete(
    {
      semesterRegistration: id,
    },
    // { session },
  );

  if (!deleteOfferedCourse)
    throw new AppError(500, 'Offered course delete failed!');

  // await session.commitTransaction();
  // await session.endSession();
  return deleteSemesterRegistration;
  // } catch (error) {
  // await session.abortTransaction();
  // await session.endSession();
  // throw new AppError(500, 'Semester registration delete failed!');
  // }
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
