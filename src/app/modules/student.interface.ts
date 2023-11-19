export interface Username {
  firstName: string;
  middleName: string;
  lastName: string;
}

export interface Guardian {
  fatherName: string;
  motherName: string;
  fatherPassion: string;
  motherPassion: string;
}

enum BloodGroup {
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
}

export interface Student {
  studentId: string;
  name: Username;
  age: number;
  email: string;
  number: string;
  bloodGroup?: BloodGroup;
  guardian: Guardian;
  familyMember: number;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE';
}
