import { z } from "zod";

const createAppointment = z.object({
  body: z.object({
    doctorId: z.string({
      required_error: "Doctor ID is required",
    }),
    scheduleId: z.string({
      required_error: "Schedule ID is required",
    }),
  }),
});

export const AppointmentValidationSchema = {
  createAppointment,
};
