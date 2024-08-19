import { AppointmentStatus, PaymentStatus, UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import dbClient from '../../../prisma';
import AppError from '../../error/AppError';

/* --------------->> Create Prescription  <<------------- */
const createPrescription = async (
  user: JwtPayload,
  payload: {
    appointmentId: string;
    instructions: string;
    followUpDate: string;
  },
) => {
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

  // check doctor
  if (!user || user.email !== appointment.doctor.email) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You cannot create Prescription for this appointment',
    );
  }

  // create Prescription
  const Prescription = await dbClient.prescription.create({
    data: {
      appointmentId: appointment.id,
      doctorId: appointment.doctorId,
      patientId: appointment.patientId,
      instructions: payload.instructions,
      followUpDate: payload.followUpDate,
    },
  });

  return Prescription;
};

/* --------------->> Get Prescription <<------------- */
const getMyPrescription = async (user: JwtPayload) => {
  if (user && user.role === UserRole.DOCTOR) {
    const doctor = await dbClient.doctor.findUniqueOrThrow({
      where: {
        email: user.email,
      },
    });

    const Prescriptions = await dbClient.prescription.findMany({
      where: {
        doctorId: doctor.id,
      },
      include: {
        appointment: true,
        patient: true,
      },
    });

    return Prescriptions;
  } else if (user && user.role === UserRole.PATIENT) {
    const patient = await dbClient.patient.findUniqueOrThrow({
      where: {
        email: user.email,
      },
    });

    const prescriptions = await dbClient.prescription.findMany({
      where: {
        patientId: patient.id,
      },
      include: {
        appointment: true,
        doctor: true,
      },
    });

    return prescriptions;
  }
};

export const PrescriptionServices = { createPrescription, getMyPrescription };
