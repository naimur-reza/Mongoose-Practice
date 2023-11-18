import { Request, Response } from 'express'
import { StudentServices } from './student.service'

const createStudent = async (req: Request, res: Response) => {
  const student = req.body
  await StudentServices.createStudentInDb(student)

  return res.status(200).json({
    success: true,
    message: 'Student info inserted successfully',
  })
}

export const StudentController = {
  createStudent,
}
