import { Schema, model } from 'mongoose';
import { ISemesterRegistration } from './semesterRegistration.interface';

const semesterRegistrationSchema = new Schema<ISemesterRegistration>({
  academicSemester: { type: Schema.Types.ObjectId, ref: 'AcademicSemester' },
  status: {
    type: String,
    enum: ['UPCOMING', 'ONGOING', 'ENDED'],
    default: 'UPCOMING',
  },
  maxCredit: { type: Number },
  minCredit: { type: Number },
  endDate: { type: Date },
  startDate: { type: Date },
});

export const SemesterRegistration = model<ISemesterRegistration>(
  'SemesterRegistration',
  semesterRegistrationSchema,
);
