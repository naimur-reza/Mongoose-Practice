import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();

router.get('/', StudentControllers.getAllStudents);

router.get('/:id', StudentControllers.getSingleStudent);

router.patch('/:id', StudentControllers.deleteStudent);

router.patch('/:id', StudentControllers.updateStudent);

export const StudentRoutes = router;
