import { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = 500;
  const message = err.message || "Something went wrong!";
  res.status(500).send({
    success: false,
    status: statusCode,
    message: message,
  });
  next();
};

export default globalErrorHandler;
