import express from 'express';
import { StudentControllers } from './student.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get('/', auth('admin'), StudentControllers.getAllStudents);

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  StudentControllers.getSingleStudent,
);

router.patch('/:id', auth('admin'), StudentControllers.deleteStudent);

router.patch('/:id', StudentControllers.updateStudent);

export const StudentRoutes = router;
