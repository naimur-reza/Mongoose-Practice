import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { createAdminValidationSchema } from '../Admin/admin.validation';

import { createStudentValidationSchema } from './../student/student.validation';

import { UserControllers } from './user.controller';
import { AcademicFacultyValidation } from '../academicFaculty/academicFaculty.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-student',
  auth(),
  validateRequest(createStudentValidationSchema),
  UserControllers.createStudent,
);

router.post(
  '/create-faculty',

  validateRequest(
    AcademicFacultyValidation.createAcademicFacultyValidationSchema,
  ),
  UserControllers.createFaculty,
);

router.post(
  '/create-admin',

  validateRequest(createAdminValidationSchema),
  UserControllers.createAdmin,
);

export const UserRoutes = router;
