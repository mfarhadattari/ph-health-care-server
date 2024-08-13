import { Admin, Doctor, Patient } from "@prisma/client";

export interface ICreateAdmin {
  password: string;
  admin: Admin;
}

export interface ICreateDoctor {
  password: string;
  doctor: Doctor;
}

export interface ICreatePatient {
  password: string;
  patient: Patient;
}
