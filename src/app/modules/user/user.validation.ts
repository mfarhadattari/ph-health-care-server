import { z } from "zod";

const createAdmin = z.object({
  body: z.object({
    password: z.string({
      required_error: "Password must be provide.",
    }),
    admin: z.object({
      name: z.string({
        required_error: "Name must be provided.",
      }),
      email: z
        .string({
          required_error: "Email must be provided.",
        })
        .email(),
      contactNumber: z.string({
        required_error: "Contact number must be provided.",
      }),
    }),
  }),
});

export const UserValidationSchema = {
  createAdmin,
};
