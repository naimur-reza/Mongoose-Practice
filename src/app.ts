import express, { Application } from 'express';
import cors from 'cors';
import { StudentRoutes } from './app/modules/student.route';
export const app: Application = express();
app.use(express.json());
app.use(cors());
app.get('/');

// app routes
app.use('/api/v1/students', StudentRoutes);
