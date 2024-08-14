import { Gender } from "@prisma/client";
import { z } from "zod";

const updateDoctor = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
    registrationNumber: z.string().optional(),
    experience: z.number().positive().optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE]).optional(),
    appointmentFee: z.number().positive().optional(),
    qualification: z.string().optional(),
    currentWorkingPlace: z.string().optional(),
    designation: z.string().optional(),
    specialties: z
      .array(
        z.object({
          id: z.string(),
          isDeleted: z.boolean(),
        })
      )
      .optional(),
  }),
});

export const DoctorValidationSchema = {
  updateDoctor,
};
