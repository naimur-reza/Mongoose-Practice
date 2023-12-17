import { Router } from 'express';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
import {
  createSemesterRegistrationValidationSchema,
  updateSemesterRegistrationValidationSchema,
} from './semesterRegistration.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

router.post(
  '/create-semester-registration',
  validateRequest(createSemesterRegistrationValidationSchema),
  SemesterRegistrationControllers.createSemesterRegistrationIntoDB,
);

router.get(
  '/',
  SemesterRegistrationControllers.getAllSemesterRegistrationIntoDB,
);
router.get(
  '/:id',
  SemesterRegistrationControllers.getSingleSemesterRegistrationIntoDB,
);

router.patch(
  '/:id',
  validateRequest(updateSemesterRegistrationValidationSchema),
  SemesterRegistrationControllers.updateSemesterRegistrationIntoDB,
);

router.delete(
  '/:id',
  SemesterRegistrationControllers.deleteSemesterRegistrationFromDB,
);

export const SemesterRegistrationRouter = router;
