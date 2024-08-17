import {
  AppointmentStatus,
  PaymentStatus,
  Review,
  UserRole,
} from "@prisma/client";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import dbClient from "../../../prisma";
import AppError from "../../error/AppError";

/* --------------->> Create Review <<------------- */
const createReview = async (user: JwtPayload, payload: Review) => {
  // check appointment
  const appointment = await dbClient.appointment.findUniqueOrThrow({
    where: {
      id: payload.appointmentId,
      paymentStatus: PaymentStatus.PAID,
      status: AppointmentStatus.COMPLETED,
    },
    include: {
      doctor: true,
      patient: true,
    },
  });

  // check patient
  if (!user || user.email !== appointment.patient.email) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You cannot create review for this appointment"
    );
  }

  // check already reviewed
  const isReviewExist = await dbClient.review.findUnique({
    where: {
      appointmentId: appointment.id,
    },
  });

  if (isReviewExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "You already reviewed");
  }
  const result = await dbClient.$transaction(async (txClient) => {
    // create prescription
    const review = await txClient.review.create({
      data: {
        appointmentId: appointment.id,
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        rating: payload.rating,
        comment: payload.comment,
      },
    });

    // calculating doctor avg review
    const averageRating = await txClient.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        doctorId: appointment.doctorId,
      },
    });

    // update doctor review
    await txClient.doctor.update({
      where: {
        id: appointment.doctorId,
      },
      data: {
        averageRating: averageRating._avg.rating as number,
      },
    });

    return review;
  });

  return result;
};

/* --------------->> Get My Reviews <<------------- */
const getMyReviews = async (user: JwtPayload) => {
  if (user && user.role === UserRole.DOCTOR) {
    const doctor = await dbClient.doctor.findUniqueOrThrow({
      where: {
        email: user.email,
      },
    });

    const reviews = await dbClient.review.findMany({
      where: {
        doctorId: doctor.id,
      },
      include: {
        patient: true,
      },
    });

    return reviews;
  } else if (user && user.role === UserRole.PATIENT) {
    const patient = await dbClient.patient.findUniqueOrThrow({
      where: {
        email: user.email,
      },
    });

    const reviews = await dbClient.review.findMany({
      where: {
        patientId: patient.id,
      },
      include: {
        doctor: true,
      },
    });

    return reviews;
  }
};

export const ReviewServices = { createReview, getMyReviews };
