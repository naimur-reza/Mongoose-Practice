import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFaculty } from './academicFaculty.model';

const createAcademicFacultyIntoDB = (data: TAcademicFaculty) => {
  const res = AcademicFaculty.create(data);
  return res;
};

const getAllFacultiesFromDB = async () => {
  const result = await AcademicFaculty.find();
  return result;
};

const getSingleFacultyFromDB = async (id: string) => {
  const result = await AcademicFaculty.aggregate([{ $match: { id } }]);
  return result;
};

export const FacultiesServices = {
  createAcademicFacultyIntoDB,
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
};
