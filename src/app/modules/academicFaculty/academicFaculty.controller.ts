import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FacultiesServices } from './academicFaculty.service';

const getSingleFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await FacultiesServices.getSingleFacultyFromDB(facultyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is retrieved successfully',
    data: result,
  });
});

const getAllFaculties: RequestHandler = catchAsync(async (req, res) => {
  const result = await FacultiesServices.getAllFacultiesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty are retrieved successfully',
    data: result,
  });
});

const createAcademicFaculty = catchAsync(async (req, res) => {
  const { data } = req.body;
  const result = await FacultiesServices.createAcademicFacultyIntoDB(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is created successfully',
    data: result,
  });
});
const updateAcademicFaculty = catchAsync(async (req, res) => {
  const id = req.params.facultyId;
  const { data } = req.body;
  const result = await FacultiesServices.updateAcademicFaculty(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is created successfully',
    data: result,
  });
});

export const FacultyControllers = {
  getAllFaculties,
  getSingleFaculty,
  createAcademicFaculty,
  updateAcademicFaculty,
};
