import { z } from 'zod';

const createSchedule = z.object({
  body: z.object({
    startDate: z
      .string({
        required_error: 'Start date must be provided',
      })
      .date(),
    endDate: z
      .string({
        required_error: 'End date must be provided',
      })
      .date(),
    startTime: z
      .string({
        required_error: 'Start Time must be provided',
      })
      .time(),
    endTime: z
      .string({
        required_error: 'End time must be provided',
      })
      .time(),
  }),
});
export const ScheduleValidationSchema = {
  createSchedule,
};
