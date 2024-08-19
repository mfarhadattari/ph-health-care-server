/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import AppError from '../error/AppError';

export const generateToken = async (
  payload: JwtPayload,
  secret: Secret,
  expiresIn: string,
) => {
  let token: string;
  try {
    token = await jwt.sign(payload, secret, { expiresIn });
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
  return token;
};

export const decodeToken = async (token: string, secret: Secret) => {
  let decodedPayload: JwtPayload;
  try {
    decodedPayload = (await jwt.verify(token, secret)) as JwtPayload;
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
  return decodedPayload;
};
