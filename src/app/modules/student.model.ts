import { Schema, model } from 'mongoose';
import { Guardian, Student, Username } from './student.interface';

const usernameSchema = new Schema<Username>({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
});

const guardianSchema = new Schema<Guardian>({
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  fatherPassion: { type: String, required: true },
  motherPassion: { type: String, required: true },
});

const studentSchema = new Schema<Student>({
  studentId: { type: String, required: true },
  name: usernameSchema,
  age: { type: Number, required: true },
  avatar: { type: String, required: true },
  bloodGroup: ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'],
  email: { type: String, required: true },
  number: { type: String, required: true },
  familyMember: { type: Number, required: true },
  guardian: guardianSchema,
  status: ['ACTIVE', 'INACTIVE'],
});

export const StudentModel = model<Student>('Student', studentSchema);
