import { AppointmentStatus, PaymentStatus } from "@prisma/client";

export interface IAppointmentPayload {
  status?: AppointmentStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
}
