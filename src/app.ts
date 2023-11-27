import express, { Application, Request, Response } from "express";
import cors from "cors";
import { StudentRoutes } from "./app/modules/student.route";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
export const app: Application = express();
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    message: "server is running!",
  });
});

// app routes
app.use("/api/v1/students", StudentRoutes);

// global error handler middleware

app.use(notFound);
app.use(globalErrorHandler);
