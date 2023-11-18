import { Student } from './student.interface'
import { StudentModel } from './student.model'

const createStudentInDb = async (student: Student) => {
  const res = await StudentModel.create(student)
  return res
}

export const StudentServices = {
  createStudentInDb,
}
