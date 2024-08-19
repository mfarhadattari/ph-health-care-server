import { BloodGroup, Gender, MaritalStatus } from '@prisma/client';
import { z } from 'zod';

const ZodBloodGroup = z.enum([
  BloodGroup.A_POSITIVE,
  BloodGroup.A_NEGATIVE,
  BloodGroup.B_POSITIVE,
  BloodGroup.B_NEGATIVE,
  BloodGroup.AB_POSITIVE,
  BloodGroup.AB_NEGATIVE,
  BloodGroup.O_POSITIVE,
  BloodGroup.O_NEGATIVE,
]);

const updatePatient = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
    address: z.string().optional(),
  }),
});

const updatePatientHealthData = z.object({
  body: z.object({
    dateOfBirth: z.string().datetime().optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE]).optional(),
    bloodGroup: ZodBloodGroup.optional(),
    hasAllergies: z.boolean().optional(),
    hasDiabetes: z.boolean().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    smokingStatus: z.boolean().optional(),
    dietaryPreferences: z.string().optional(),
    mentalHealthHistory: z.string().optional(),
    immunizationStatus: z.string().optional(),
    hasPastSurgeries: z.boolean().optional(),
    recentAnxiety: z.boolean().optional(),
    recentDepression: z.boolean().optional(),
    maritalStatus: z
      .enum([MaritalStatus.MARRIED, MaritalStatus.UNMARRIED])
      .optional(),
  }),
});

export const PatientValidationSchema = {
  updatePatient,
  updatePatientHealthData,
};
