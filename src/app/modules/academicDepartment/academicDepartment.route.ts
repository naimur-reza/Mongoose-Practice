import express from 'express';
import { DepartmentControllers } from './academicDepartment.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidation } from './academicDepartment.validation';

const router = express.Router();

router.get('/', DepartmentControllers.getAllDepartments);
router.post(
  '/create-academic-department',
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
