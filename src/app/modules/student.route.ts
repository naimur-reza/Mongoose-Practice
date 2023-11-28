import express, { NextFunction, Request, Response } from "express";
import { StudentController } from "./student.controller";
import { studentValidationSchema } from "./student.validation";
import { AnyZodObject } from "zod";

const router = express.Router();

const checkValidation = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const student = req.body;
    await schema.parseAsync(student).catch(err => next(err));
    next();
  };
};

router.post(
  "/create-student",
  checkValidation(studentValidationSchema),
  StudentController.createStudent,
);
router.get("/", StudentController.getAllStudents);
router.get("/:id", StudentController.getSingleStudent);

export const StudentRoutes = router;
