import express from 'express';
import { FacultyControllers } from './academicFaculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { academicFacultyValidation } from './academicFaculty.validation';

const router = express.Router();

router.get('/', FacultyControllers.getAllFaculties);
router.post(
  '/',
  validateRequest(academicFacultyValidation),
  FacultyControllers.createAcademicFaculty,
);

router.get('/:facultyId', FacultyControllers.getSingleFaculty);

router.patch(
  '/:facultyId',
  validateRequest(academicFacultyValidation),
  FacultyControllers.updateAcademicFaculty,
);

export const StudentRoutes = router;
