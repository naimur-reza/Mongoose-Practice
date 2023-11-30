import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FacultiesServices } from './academicFaculty.service';

const createFaculty = catchAsync(async (req, res) => {
  const { faculty: facultyData } = req.body;

  const result =
    await FacultiesServices.createAcademicFacultyIntoDB(facultyData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is created successfully',
    data: result,
  });
});

export const FacultyControllers = {
  createFaculty,
};
