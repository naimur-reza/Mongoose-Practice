import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DepartmentsServices } from './academicDepartment.service';

const getSingleDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result =
    await DepartmentsServices.getSingleDepartmentFromDB(departmentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department is retrieved successfully',
    data: result,
  });
});

const getAllDepartments: RequestHandler = catchAsync(async (req, res) => {
  const result = await DepartmentsServices.getAllDepartmentsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department are retrieved successfully',
    data: result,
  });
});

const createAcademicDepartment = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await DepartmentsServices.createAcademicDepartmentIntoDB(data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department is created successfully',
    data: result,
  });
});
const updateAcademicDepartment = catchAsync(async (req, res) => {
  const id = req.params.departmentId;
  const data = req.body;
  const result = await DepartmentsServices.updateAcademicDepartment(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department is updated successfully',
    data: result,
  });
});

export const DepartmentControllers = {
  getAllDepartments,
  getSingleDepartment,
  createAcademicDepartment,
  updateAcademicDepartment,
};
