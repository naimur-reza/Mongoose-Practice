import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../errors/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
// import validateUser from './validateUser';
import { User } from '../modules/user/user.model';
import httpStatus from 'http-status';
const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) throw new AppError(401, 'Unauthorized access!');

    const decoded = jwt.verify(token, config.jwt_access_secret!) as JwtPayload;

    const { userId, role, iat } = decoded;

    // validate if user is authorized
    // await validateUser(userId);

    const user = await User.findOne({ id: userId });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted

    const isDeleted = user.isDeleted;

    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
    }

    // checking if the user is blocked

    const userStatus = user.status;

    if (userStatus === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
    }

    // check the required roles who is can do hit the route
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(401, 'Unauthorized access');
    }

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(401, 'Unauthorized access');
    }

    req.user = decoded;
    next();
  });
};

export default auth;
