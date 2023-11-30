import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';

const createAcademicDepartmentIntoDB = (data: TAcademicDepartment) => {
  const res = AcademicDepartment.create(data);
  return res;
};

const getAllDepartmentsFromDB = async () => {
  const result = await AcademicDepartment.find();
  return result;
};

const getSingleDepartmentFromDB = async (id: string) => {
  const result = await AcademicDepartment.findById(id);
  return result;
};

const updateAcademicDepartment = async (
  id: string,
  data: TAcademicDepartment,
) => {
  const res = await AcademicDepartment.findByIdAndUpdate({ _id: id }, data, {
    new: true,
    runValidators: true,
  });
  return res;
};

export const DepartmentsServices = {
  createAcademicDepartmentIntoDB,
  getAllDepartmentsFromDB,
  getSingleDepartmentFromDB,
  updateAcademicDepartment,
};
