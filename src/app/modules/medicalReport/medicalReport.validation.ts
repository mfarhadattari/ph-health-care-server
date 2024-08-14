import { z } from "zod";

const createMedicalReport = z.object({
  body: z.object({
    patientId: z.string({
      required_error: "Patient Id is required",
    }),
    reportName: z.string({
      required_error: "Report name is required",
    }),
    reportLink: z.string({
      required_error: "Report Link is required",
    }),
  }),
});

export const MedicalReportValidationSchema = {
  createMedicalReport,
};
