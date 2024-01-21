import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

const validateCookie = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      cookies: req.cookies,
    });

    next();
  });
};

export default validateCookie;
