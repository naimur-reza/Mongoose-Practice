import { RequestHandler } from "express";
import { StudentServices } from "./student.service";

import sendResponse from "../utils/sendResponse";
import httpStatus from "http-status";
import { catchAsync } from "../utils/catchAsync";

const createStudent: RequestHandler = catchAsync(async (req, res, next) => {
  const student = req.body;

  // const zodParseData = studentValidationSchema.parse(student);

  await StudentServices.createStudentInDb(student);

  sendResponse(res, {
    success: true,
    message: "Student info inserted successfully",
    data: res,
    statusCode: httpStatus.OK,
  });
});

const getAllStudents: RequestHandler = catchAsync(async (req, res, next) => {
  const data = await StudentServices.getStudents();
  return res.status(200).send(data);
});

const getSingleStudent: RequestHandler = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const data = await StudentServices.getSingleStudentFromDB(id);
  return res.status(200).send(data);
});

export const StudentController = {
  createStudent,
  getAllStudents,
  getSingleStudent,
};
