import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../errors/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) throw new AppError(401, 'Unauthorized access!');

    jwt.verify(token, config.jwt_access_secret!, (err, decoded) => {
      if (err) throw new AppError(401, 'Unauthorized access');
      req.user = decoded as JwtPayload;
      next();
    });
  });
};

export default auth;
