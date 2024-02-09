import { NextFunction, Request, Response } from 'express';

export const parseFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    req.body = JSON.parse(req.body.data);
    next();
  } catch (error) {
    next(error);
  }
};
