import { UserRole } from "@prisma/client";
import dbClient from "../../../prisma";
import { IFile } from "../../interface/file";
import { hashPassword } from "../../utils/bcryptHelper";
import { uploadToCloud } from "../../utils/fileUpload";
import { ICreateAdmin, ICreateDoctor, ICreatePatient } from "./user.interface";

const createAdmin = async (payload: ICreateAdmin, file: IFile | null) => {
  const admin = payload.admin;
  const password = await hashPassword(payload.password);
  const user = {
    email: admin.email,
    password: password,
    role: UserRole.ADMIN,
  };

  if (file) {
    // upload the file
    const { secure_url } = await uploadToCloud(file, `avatar-${admin.email}`);
    admin.profilePhoto = secure_url;
  }

  const result = await dbClient.$transaction(async (txClient) => {
    await txClient.user.create({ data: user });

    const adminCreate = await txClient.admin.create({
      data: admin,
    });

    return adminCreate;
  });

  return result;
};

const createDoctor = async (payload: ICreateDoctor, file: IFile | null) => {
  const doctor = payload.doctor;
  const password = await hashPassword(payload.password);
  const user = {
    email: doctor.email,
    password: password,
    role: UserRole.DOCTOR,
  };

  if (file) {
    // upload the file
    const { secure_url } = await uploadToCloud(file, `avatar-${doctor.email}`);
    doctor.profilePhoto = secure_url;
  }

  console.log({
    doctor,
    user,
  });

  const result = await dbClient.$transaction(async (txClient) => {
    await txClient.user.create({ data: user });

    const doctorCreate = await txClient.doctor.create({
      data: doctor,
    });

    return doctorCreate;
  });

  return result;
};

const createPatient = async (payload: ICreatePatient, file: IFile | null) => {
  const patient = payload.patient;
  const password = await hashPassword(payload.password);
  const user = {
    email: patient.email,
    password: password,
    role: UserRole.PATIENT,
  };

  if (file) {
    // upload the file
    const { secure_url } = await uploadToCloud(file, `avatar-${patient.email}`);
    patient.profilePhoto = secure_url;
  }

  console.log({
    doctor: patient,
    user,
  });

  const result = await dbClient.$transaction(async (txClient) => {
    await txClient.user.create({ data: user });

    const patientCreate = await txClient.patient.create({
      data: patient,
    });

    return patientCreate;
  });

  return result;
};

export const UserServices = { createAdmin, createDoctor, createPatient };
