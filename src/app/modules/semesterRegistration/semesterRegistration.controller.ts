import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { SemesterRegistrationServices } from './semesterRegistration.service';
import sendResponse from '../../utils/sendResponse';

const createSemesterRegistrationIntoDB = catchAsync(
  async (req: Request, res: Response) => {
    const registration =
      await SemesterRegistrationServices.createSemesterRegistrationIntoDB(
        req.body,
      );

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: 'Registration Successfully',
      data: registration,
    });
  },
);
const getAllSemesterRegistrationIntoDB = catchAsync(
  async (req: Request, res: Response) => {
    const registration =
      await SemesterRegistrationServices.getAllSemesterRegistrationFromDB(
        req.body,
      );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Registrations Retrieved Successfully',
      data: registration,
    });
  },
);
const getSingleSemesterRegistrationIntoDB = catchAsync(
  async (req: Request, res: Response) => {
    const registration =
      await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(
        req.params.id,
      );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Registration Retrieved Successfully',
      data: registration,
    });
  },
);
const updateSemesterRegistrationIntoDB = catchAsync(
  async (req: Request, res: Response) => {
    const registration =
      await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(
        req.params.id,
        req.body,
      );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Registration updated Successfully',
      data: registration,
    });
  },
);
const deleteSemesterRegistrationFromDB = catchAsync(
  async (req: Request, res: Response) => {
    const registration =
      await SemesterRegistrationServices.deleteSemesterRegistrationFromDB(
        req.params.id,
      );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Registration deleted Successfully',
      data: registration,
    });
  },
);

export const SemesterRegistrationControllers = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationIntoDB,
  getSingleSemesterRegistrationIntoDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
