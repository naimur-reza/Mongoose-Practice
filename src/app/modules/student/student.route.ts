import express from 'express';
import { StudentControllers } from './student.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', auth('admin'), StudentControllers.getAllStudents);

router.get(
  '/:id',
  auth('admin', 'faculty'),
  StudentControllers.getSingleStudent,
);

router.patch('/:id', auth('admin'), StudentControllers.deleteStudent);

router.patch('/:id', StudentControllers.updateStudent);

export const StudentRoutes = router;
