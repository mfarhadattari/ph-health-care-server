import bcrypt from "bcrypt";

export const matchPassword = async (
  planPassword: string,
  hashPassword: string
) => {
  let isMatch: boolean = false;
  try {
    isMatch = await bcrypt.compare(planPassword, hashPassword);
  } catch (error: any) {
    throw new Error(error.message);
  }
  return isMatch;
};

export const hashPassword = async (password: string) => {
  let hashedPassword: string | null = null;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error: any) {
    throw new Error(error.message);
  }
  return hashedPassword;
};
