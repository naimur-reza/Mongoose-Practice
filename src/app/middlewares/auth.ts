import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../errors/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    console.log(token);
    if (!token) throw new AppError(401, 'Unauthorized access!');

    jwt.verify(token, config.jwt_access_secret!, (err, decoded) => {
      if (err) throw new AppError(401, 'Unauthorized access');
      req.user = decoded as JwtPayload;
      const role = (decoded as JwtPayload)?.role;
      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(401, 'Unauthorized access');
      }
      next();
    });
  });
};

export default auth;
