import { Router } from 'express';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';

import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';

const router = Router();

router.post(
  '/create-semester-registration',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistrationIntoDB,
);

router.get(
  '/',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  SemesterRegistrationControllers.getAllSemesterRegistrationIntoDB,
);
router.get(
  '/:id',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  SemesterRegistrationControllers.getSingleSemesterRegistrationIntoDB,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.updateSemesterRegistrationIntoDB,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  SemesterRegistrationControllers.deleteSemesterRegistrationFromDB,
);

export const SemesterRegistrationRouter = router;
