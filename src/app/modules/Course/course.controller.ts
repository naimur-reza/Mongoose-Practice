import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseService } from './course.service';

const createCourse: RequestHandler = catchAsync(async (req, res) => {
  const result = await CourseService.createCourse(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course created successfully!',
    data: result,
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result = await CourseService.getSingleCourseFromDB(semesterId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is retrieved successfully!',
    data: result,
  });
});

const getAllCourses: RequestHandler = catchAsync(async (req, res) => {
  const result = await CourseService.getAllCoursesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses are retrieved successfully!',
    data: result,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const updateData = req.body.course;
  const { id } = req.params;
  const result = await CourseService.updateCourseFromDB(id, updateData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is updated successfully!',
    data: result,
  });
});
const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseService.deleteCourseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is deleted successfully!',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  deleteCourse,
  updateCourse,
};
