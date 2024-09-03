import { UserRole, UserStatus } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import dbClient from '../../prisma';
import config from '../config';
import AppError from '../error/AppError';
import { decodeToken } from '../utils/jwtHelper';

const authValidator = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'Authentication token is required',
        );
      }

      const decoded = await decodeToken(token, config.access_token_secret);
      if (!decoded) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Token is invalid');
      }

      if (!roles.includes(decoded.role)) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'Unauthorized, user does not have access',
        );
      }

      await dbClient.user.findUniqueOrThrow({
        where: {
          email: decoded.email,
          status: UserStatus.ACTIVE,
        },
      });

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authValidator;
