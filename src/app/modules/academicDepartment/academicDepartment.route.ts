import express from 'express';
import { DepartmentControllers } from './academicDepartment.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get('/', DepartmentControllers.getAllDepartments);
router.post(
  '/create-academic-department',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    AcademicDepartmentValidation.createAcademicDepartmentValidationSchema,
  ),

  DepartmentControllers.createAcademicDepartment,
);

router.get('/:departmentId', DepartmentControllers.getSingleDepartment);

router.patch(
  '/:departmentId',
  validateRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentValidationSchema,
  ),
  DepartmentControllers.updateAcademicDepartment,
);

export const AcademicDepartmentRoutes = router;
