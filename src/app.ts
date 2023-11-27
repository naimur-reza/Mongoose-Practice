import express, { Application } from "express";
import cors from "cors";
import { StudentRoutes } from "./app/modules/student.route";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
export const app: Application = express();
app.use(express.json());
app.use(cors());
app.get("/");

// app routes
app.use("/api/v1/students", StudentRoutes);

// global error handler middleware

app.use(globalErrorHandler);
