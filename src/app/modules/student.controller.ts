import { Request, Response } from 'express';
import { StudentServices } from './student.service';

const createStudent = async (req: Request, res: Response) => {
  try {
    const student = req.body;
    await StudentServices.createStudentInDb(student);

    return res.status(200).json({
      success: true,
      message: 'Student info inserted successfully',
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const data = await StudentServices.getStudents();
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = StudentServices.getSingleStudentFromDB(id);
    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
  }
};

export const StudentController = {
  createStudent,
  getAllStudents,
  getSingleStudent,
};
