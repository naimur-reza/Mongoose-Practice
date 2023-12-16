import QueryBuilder from '../../builder/queryBuilder';
import { AppError } from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
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
  const result = await SemesterRegistration.findByIdAndUpdate(id, payload);
  return result;
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
};
