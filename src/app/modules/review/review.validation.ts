import { z } from "zod";

const createReview = z.object({
  body: z.object({
    appointmentId: z.string({
      required_error: "Appointment ID is required",
    }),
    rating: z
      .number({
        required_error: "Rating is required",
      })
      .positive()
      .min(0.0)
      .max(5.0),
    comment: z.string({
      required_error: "Comment is required",
    }),
  }),
});

export const ReviewValidationSchema = { createReview };
