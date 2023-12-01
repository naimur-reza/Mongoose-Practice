import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();

router.get('/:semesterId', StudentControllers.getSingleStudent);

router.delete('/:semesterId', StudentControllers.deleteStudent);

router.get('/', StudentControllers.getAllStudents);

export const StudentRoutes = router;
