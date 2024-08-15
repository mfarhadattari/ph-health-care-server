import { UserStatus } from "@prisma/client";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import dbClient from "../../../prisma";
import config from "../../config";
import AppError from "../../error/AppError";
import { hashPassword, matchPassword } from "../../utils/bcryptHelper";
import { decodeToken, generateToken } from "../../utils/jwtHelper";
import { IChangePassword, ILoginUser } from "./auth.interface";
import { sendResetEmail } from "./auth.utils";

/* -------------->> Login User <<------------ */
const loginUser = async (payload: ILoginUser) => {
  // find user
  const user = await dbClient.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  // check password
  const isPassMatch = await matchPassword(payload.password, user.password);
  if (!isPassMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Wrong password");
  }

  // generate token
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  const accessToken = await generateToken(
    jwtPayload,
    config.access_token_secret,
    config.access_token_expires
  );
  const refreshToken = await generateToken(
    jwtPayload,
    config.refresh_token_secret,
    config.refresh_token_expires
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

/* -------------->> Refresh Token <<------------ */
const refreshToken = async (token: string) => {
  const decoded = await decodeToken(token, config.refresh_token_secret);
  // find user
  const user = await dbClient.user.findUniqueOrThrow({
    where: {
      email: decoded.email,
      status: UserStatus.ACTIVE,
    },
  });

  // generate token
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = await generateToken(
    jwtPayload,
    config.access_token_secret,
    config.access_token_expires
  );

  return {
    accessToken,
  };
};

/* -------------->> Change Password <<------------ */
const changePassword = async (user: JwtPayload, payload: IChangePassword) => {
  const userData = await dbClient.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  // check password
  const isPassMatch = await matchPassword(
    payload.oldPassword,
    userData.password
  );
  if (!isPassMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Wrong password");
  }

  // store new password
  const password = await hashPassword(payload.newPassword);
  await dbClient.user.update({
    where: {
      id: userData.id,
    },
    data: {
      password: password,
      needPasswordChange: false,
    },
  });
};

/* -------------->> Forget Password <<------------ */
const forgetPassword = async (payload: { email: string }) => {
  const user = await dbClient.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  // generate reset token
  const jwtPayload = {
    email: user.email,
    userId: user.id,
    role: user.role,
  };
  const resetToken = await generateToken(
    jwtPayload,
    config.refresh_token_secret,
    config.refresh_token_expires
  );
  const resetLink = `${config.client_base_url}/reset-password?id=${user.id}&token=${resetToken}`;

  sendResetEmail({
    email: user.email,
    resetLink,
  });
};

/* -------------->> Reset Password <<------------ */
const resetPassword = async (payload: {
  id: string;
  password: string;
  token: string;
}) => {
  const decoded = await decodeToken(payload.token, config.refresh_token_secret);
  if (!decoded || decoded.id != payload.id) {
    throw new AppError(httpStatus.FORBIDDEN, "Invalid token");
  }

  await dbClient.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  // store new password
  const password = await hashPassword(payload.password);
  await dbClient.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password: password,
    },
  });
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgetPassword,
  resetPassword,
};
