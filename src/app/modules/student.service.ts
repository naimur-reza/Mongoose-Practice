import { Student } from "./student.interface";
import { StudentModel } from "./student.model";

const createStudentInDb = async (student: Student) => {
  const res = await StudentModel.create(student);
  return res;
};

const getStudents = async () => {
  const res = await StudentModel.find({});
  return res;
};

const getSingleStudentFromDB = async (id: string) => {
  const res = StudentModel.findOne({ studentId: id });
  return res;
};

export const StudentServices = {
  createStudentInDb,
  getStudents,
  getSingleStudentFromDB,
};
