import { Admin } from "@prisma/client";

export interface ICreateAdmin {
  password: string;
  admin: Admin;
}
