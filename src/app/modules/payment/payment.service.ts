import { PaymentStatus } from "@prisma/client";
import httpStatus from "http-status";
import dbClient from "../../../prisma";
import AppError from "../../error/AppError";
import { sslPay } from "../../utils/ssl";

/* --------------->> Init Payment <<------------- */
const initPayment = async (appointmentId: string) => {
  const paymentData = await dbClient.payment.findFirst({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });
  if (!paymentData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Payment information not found!"
    );
  }
  if (paymentData.status === PaymentStatus.PAID) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already pay for the appointment!"
    );
  }

  const paymentSession = await sslPay.initPayment({
    amount: paymentData.amount,
    transactionId: paymentData.transactionId,
    customerName: paymentData.appointment.patient.name,
    customerEmail: paymentData.appointment.patient.email,
    customerContract: paymentData.appointment.patient.contactNumber,
  });

  return { paymentUrl: paymentSession.GatewayPageURL };
};

/* --------------->> Valid Payment <<------------- */
const validatePayment = async (payload: any) => {
  /* if (!payload || !payload?.status || payload?.status !== "VALID") {
    return {
      massage: "Invalid Payment!",
    };
  }

  const result = await sslPay.validatePayment(payload);
  if (result?.status !== "VALID") {
    return {
      massage: "Payment failed",
    };
  }
  const { tran_id } = result; */

  const { tran_id } = payload;

  await dbClient.$transaction(async (transactionClient) => {
    const paymentData = await transactionClient.payment.update({
      where: {
        transactionId: tran_id,
      },
      data: {
        status: PaymentStatus.PAID,
        paymentGatewayData: payload,
      },
    });

    await transactionClient.appointment.update({
      where: {
        id: paymentData.appointmentId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });
  });

  return {
    massage: "Payment Success",
  };
};

export const PaymentServices = { initPayment, validatePayment };
