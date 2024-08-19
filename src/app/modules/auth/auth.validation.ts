import { z } from 'zod';

const loginUser = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required.',
      })
      .email(),
    password: z.string({
      required_error: 'Password is required.',
    }),
  }),
});

const changePassword = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required.',
    }),
    newPassword: z.string({
      required_error: 'New password is required.',
    }),
  }),
});

export const AuthValidationSchema = {
  loginUser,
  changePassword,
};
