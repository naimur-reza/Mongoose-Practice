export interface Username {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface Guardian {
  fatherName: string;
  motherName: string;
  fatherPassion: string;
  motherPassion: string;
}

export interface Student {
  studentId: string;
  name: Username;
  age: number;
  email: string;
  number: string;
  bloodGroup?: "A+" | "A-" | "AB+" | "AB-" | "B+" | "B-" | "O+" | "O-";
  guardian: Guardian;
  familyMember: number;
  avatar?: string;
  status: "ACTIVE" | "INACTIVE";
}
