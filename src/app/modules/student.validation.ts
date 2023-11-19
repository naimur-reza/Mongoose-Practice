import { z } from "zod";

const usernameValidationSchema = z.object({
  firstName: z.string().min(1).max(50),
  middleName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50),
});

const guardianValidationSchema = z.object({
  fatherName: z.string().min(1).max(50),
  motherName: z.string().min(1).max(50),
  fatherPassion: z.string().min(1).max(50),
  motherPassion: z.string().min(1).max(50),
});

export const studentValidationSchema = z.object({
  studentId: z.string().min(1).max(50),
  name: usernameValidationSchema,
  age: z.number().min(1).max(120),
  avatar: z.string().min(1).max(255),
  bloodGroup: z
    .enum(["A+", "A-", "AB+", "AB-", "B+", "B-", "O+", "O-"])
    .optional(),
  email: z.string().email(),
  number: z.string().min(1).max(15),
  familyMember: z.number().min(1).max(20),
  guardian: guardianValidationSchema,
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});
