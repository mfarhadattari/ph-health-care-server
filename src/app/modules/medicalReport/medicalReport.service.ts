import { MedicalReport } from '@prisma/client';
import dbClient from '../../../prisma';

/* ------------------->> Create MedicalReport Service <<----------------- */
const createMedicalReport = async (payload: MedicalReport) => {
  // check patient exist
  await dbClient.patient.findUniqueOrThrow({
    where: {
      id: payload.patientId,
    },
  });

  // create medical report
  const result = await dbClient.medicalReport.create({
    data: payload,
    include: {
      patient: true,
    },
  });

  return result;
};

/* ------------------->> Delete Medical Report <<----------------- */
const deleteMedicalReport = async (id: string) => {
  // check exist
  await dbClient.medicalReport.findUniqueOrThrow({
    where: {
      id,
    },
  });

  // delete
  await dbClient.medicalReport.delete({
    where: {
      id,
    },
  });
};

export const MedicalReportServices = {
  createMedicalReport,
  deleteMedicalReport,
};
