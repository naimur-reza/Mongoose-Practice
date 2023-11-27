/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const message = err.message || "Something went wrong!";
  return res.status(500).send({
    success: false,
    message: message,
  });
};

export default globalErrorHandler;
