import { Schema, model } from 'mongoose';
import { ICourse, IPreRequisiteCourses } from './course.interface';

const preRequisiteCoursesSchema = new Schema<IPreRequisiteCourses>({
  course: { type: Schema.Types.ObjectId },
  isDeleted: { type: Boolean, default: false },
});

const courseSchema = new Schema<ICourse>({
  title: { type: String, unique: true, required: true, trim: true },
  prefix: { type: String, required: true, trim: true },
  code: { type: Number, required: true, trim: true },
  credits: { type: Number, required: true, trim: true },
  preRequisiteCourses: [preRequisiteCoursesSchema],
});

export const Course = model<ICourse>('Course', courseSchema);
