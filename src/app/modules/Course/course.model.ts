import { Schema, model } from 'mongoose';
import {
  ICourse,
  ICourseFaculties,
  IPreRequisiteCourses,
} from './course.interface';

const preRequisiteCoursesSchema = new Schema<IPreRequisiteCourses>({
  course: { type: Schema.Types.ObjectId, ref: 'Course', unique: true },
  isDeleted: { type: Boolean, default: false },
});

const courseSchema = new Schema<ICourse>({
  title: { type: String, unique: true, required: true, trim: true },
  prefix: { type: String, required: true, trim: true },
  code: { type: Number, required: true, trim: true },
  credits: { type: Number, required: true, trim: true },
  preRequisiteCourses: [preRequisiteCoursesSchema],
  isDeleted: { type: Boolean, default: false },
});

export const Course = model<ICourse>('Course', courseSchema);

const courseFacultySchema = new Schema<ICourseFaculties>({
  course: { type: Schema.Types.ObjectId, ref: 'Course', unique: true },
  faculties: [{ type: Schema.Types.ObjectId, ref: 'Faculty' }],
});

export const CourseFaculty = model<ICourseFaculties>(
  'CourseFaculty',
  courseFacultySchema,
);
