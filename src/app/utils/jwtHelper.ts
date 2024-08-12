import jwt, { JwtPayload, Secret } from "jsonwebtoken";

export const generateToken = async (
  payload: JwtPayload,
  secret: Secret,
  expiresIn: string
) => {
  let token: string | null = null;
  try {
    token = await jwt.sign(payload, secret, { expiresIn });
  } catch (error: any) {
    throw new Error(error.message);
  }
  return token;
};
