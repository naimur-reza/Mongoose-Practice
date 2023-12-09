import { Types } from 'mongoose';

export interface IPreRequisiteCourses {
  course: Types.ObjectId;
  isDeleted: boolean;
}

export interface ICourse {
  title: string;
  prefix: string;
  code: number;
  credits: number;
  preRequisiteCourses: IPreRequisiteCourses[];
  isDeleted?: boolean;
}

export interface ICourseFaculties {
  course: Types.ObjectId;
  faculties: [Types.ObjectId];
}
