import { UserStatus } from "@prisma/client";
import dbClient from "../../../prisma";
import config from "../../config";
import { matchPassword } from "../../utils/bcryptHelper";
import { generateToken } from "../../utils/jwtHelper";

/* -------------->> Login User <<------------ */
const loginUser = async (payload: { email: string; password: string }) => {
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
    throw new Error("Wrong password");
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

export const AuthServices = { loginUser };
