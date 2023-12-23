import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { createAdminValidationSchema } from '../Admin/admin.validation';

import { createStudentValidationSchema } from './../student/student.validation';

import { UserControllers } from './user.controller';
import { AcademicFacultyValidation } from '../academicFaculty/academicFaculty.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  validateRequest(createStudentValidationSchema),
  UserControllers.createStudent,
);

router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  validateRequest(
    AcademicFacultyValidation.createAcademicFacultyValidationSchema,
  ),
  UserControllers.createFaculty,
);

router.post(
  '/create-admin',
  // auth(USER_ROLE.admin),
  validateRequest(createAdminValidationSchema),
  UserControllers.createAdmin,
);

router.get('/me', auth('admin', 'faculty', 'student'), UserControllers.getMe);

router.patch(
  '/change-status/:id',
  auth(USER_ROLE.admin),
  validateRequest(UserValidation.statusValidation),
  UserControllers.changeStatus,
);

export const UserRoutes = router;
