/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import dbClient from '../../prisma';
import config from '../config';
import AppError from '../error/AppError';
import { hashPassword } from './bcryptHelper';

const seedAdmin = async () => {
  try {
    const isExist = await dbClient.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
      },
    });
    if (!isExist) {
      const data = {
        email: config.super_email,
        password: await hashPassword(config.super_pass),
        role: UserRole.SUPER_ADMIN,
        admin: {
          create: {
            name: 'PH Health Care',
            contactNumber: '+880151252632',
          },
        },
      };

      await dbClient.user.create({
        data,
      });
      console.log('Super Admin Created...');
    }
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to seed super admin');
  }
};

export default seedAdmin;
