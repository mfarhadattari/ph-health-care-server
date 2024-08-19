import { Gender, UserStatus } from '@prisma/client';
import { z } from 'zod';

const createAdmin = z.object({
  body: z.object({
    password: z.string({
      required_error: 'Password must be provide.',
    }),
    admin: z.object({
      name: z.string({
        required_error: 'Name must be provided.',
      }),
      email: z
        .string({
          required_error: 'Email must be provided.',
        })
        .email(),
      contactNumber: z.string({
        required_error: 'Contact number must be provided.',
      }),
    }),
  }),
});

const createDoctor = z.object({
  body: z.object({
    password: z.string({
      required_error: 'Password must be provide.',
    }),
    doctor: z.object({
      name: z.string({
        required_error: 'Name must be provided.',
      }),
      email: z
        .string({
          required_error: 'Email must be provided.',
        })
        .email(),
      contactNumber: z.string({
        required_error: 'Contact number must be provided.',
      }),
      address: z.string().optional(),
      registrationNumber: z.string({
        required_error: 'Registration number must be provided.',
      }),
      experience: z.number().positive().optional(),
      gender: z.enum([Gender.MALE, Gender.FEMALE], {
        required_error: 'Gender must be provided.',
        invalid_type_error: 'Gender must be either MALE or FEMALE.',
      }),
      appointmentFee: z
        .number({
          required_error: 'Appointment fee must be provided.',
        })
        .positive(),
      qualification: z.string({
        required_error: 'Qualification must be provided.',
      }),
      currentWorkingPlace: z.string({
        required_error: 'Current working place must be provided.',
      }),
      designation: z.string({
        required_error: 'Designation must be provided.',
      }),
    }),
  }),
});

const createPatient = z.object({
  body: z.object({
    password: z.string({
      required_error: 'Password must be provide.',
    }),
    patient: z.object({
      name: z.string({
        required_error: 'Name must be provided.',
      }),
      email: z
        .string({
          required_error: 'Email must be provided.',
        })
        .email(),
      contactNumber: z.string({
        required_error: 'Contact number must be provided.',
      }),
      address: z.string().optional(),
    }),
  }),
});

const updateStatus = z.object({
  body: z.object({
    status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED]),
  }),
});

const updateUser = z.object({
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
  }),
});

export const UserValidationSchema = {
  createAdmin,
  createDoctor,
  createPatient,
  updateStatus,
  updateUser,
};
