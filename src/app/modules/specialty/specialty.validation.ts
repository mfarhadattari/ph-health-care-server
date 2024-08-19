import { z } from 'zod';

const createSpecialty = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
  }),
});

const updateSpecialty = z.object({
  body: z.object({
    title: z.string().optional(),
  }),
});

export const SpecialtyValidationSchema = {
  createSpecialty,
  updateSpecialty,
};
