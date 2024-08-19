import { PaymentStatus, UserRole } from '@prisma/client';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import dbClient from '../../../prisma';
import AppError from '../../error/AppError';

const getMetaData = async (user: JwtPayload) => {
  let metaData;
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
      metaData = await getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      metaData = await getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      metaData = await getDoctorMetaData(user);
      break;
    case UserRole.PATIENT:
      metaData = await getPatientMetaData(user);
      break;
    default:
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid user role!');
  }

  return metaData;
};

const getSuperAdminMetaData = async () => {
  const appointmentCount = await dbClient.appointment.count();
  const patientCount = await dbClient.patient.count();
  const doctorCount = await dbClient.doctor.count();
  const adminCount = await dbClient.admin.count();
  const paymentCount = await dbClient.payment.count();

  const totalRevenue = await dbClient.payment.aggregate({
    _sum: { amount: true },
    where: {
      status: PaymentStatus.PAID,
    },
  });

  const appointmentBarChartData = await getBarChartData();
  const appointmentPieCharData = await getPieChartData();

  return {
    appointmentCount,
    patientCount,
    doctorCount,
    adminCount,
    paymentCount,
    totalRevenue: totalRevenue?._sum?.amount || 0,
    appointmentBarChartData,
    appointmentPieCharData,
  };
};

const getAdminMetaData = async () => {
  const appointmentCount = await dbClient.appointment.count();
  const patientCount = await dbClient.patient.count();
  const doctorCount = await dbClient.doctor.count();
  const paymentCount = await dbClient.payment.count();

  const totalRevenue = await dbClient.payment.aggregate({
    _sum: { amount: true },
    where: {
      status: PaymentStatus.PAID,
    },
  });

  const appointmentBarChartData = await getBarChartData();
  const appointmentPieCharData = await getPieChartData();

  return {
    appointmentCount,
    patientCount,
    doctorCount,
    paymentCount,
    totalRevenue: totalRevenue?._sum?.amount || 0,
    appointmentBarChartData,
    appointmentPieCharData,
  };
};

const getDoctorMetaData = async (user: JwtPayload) => {
  const doctorData = await dbClient.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentCount = await dbClient.appointment.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const patientCount = await dbClient.appointment.groupBy({
    by: ['patientId'],
    _count: {
      id: true,
    },
  });

  const reviewCount = await dbClient.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const totalRevenue = await dbClient.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      appointment: {
        doctorId: doctorData.id,
      },
      status: PaymentStatus.PAID,
    },
  });

  const appointmentStatusDistribution = await dbClient.appointment.groupBy({
    by: ['status'],
    _count: { id: true },
    where: {
      doctorId: doctorData.id,
    },
  });

  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map(({ status, _count }) => ({
      status,
      count: Number(_count.id),
    }));

  return {
    appointmentCount,
    reviewCount,
    patientCount: patientCount.length,
    totalRevenue: totalRevenue?._sum?.amount || 0,
    formattedAppointmentStatusDistribution,
  };
};

const getPatientMetaData = async (user: JwtPayload) => {
  const patientData = await dbClient.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentCount = await dbClient.appointment.count({
    where: {
      patientId: patientData.id,
    },
  });

  const prescriptionCount = await dbClient.prescription.count({
    where: {
      patientId: patientData.id,
    },
  });

  const reviewCount = await dbClient.review.count({
    where: {
      patientId: patientData.id,
    },
  });

  const appointmentStatusDistribution = await dbClient.appointment.groupBy({
    by: ['status'],
    _count: { id: true },
    where: {
      patientId: patientData.id,
    },
  });

  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map(({ status, _count }) => ({
      status,
      count: Number(_count.id),
    }));

  return {
    appointmentCount,
    prescriptionCount,
    reviewCount,
    formattedAppointmentStatusDistribution,
  };
};

const getBarChartData = async () => {
  const appointmentCountByMonth: { month: Date; count: bigint }[] =
    await dbClient.$queryRaw`
        SELECT DATE_TRUNC('month', "createdAt") AS month,
        CAST(COUNT(*) AS INTEGER) AS count
        FROM "appointments"
        GROUP BY month
        ORDER BY month ASC
    `;

  return appointmentCountByMonth.map(({ month, count }) => ({
    month: month.toLocaleString('default', { month: 'long' }),
    count,
  }));
};

const getPieChartData = async () => {
  const appointmentStatusDistribution = await dbClient.appointment.groupBy({
    by: ['status'],
    _count: { id: true },
  });

  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map(({ status, _count }) => ({
      status,
      count: Number(_count.id),
    }));

  return formattedAppointmentStatusDistribution;
};

export const MetaServices = { getMetaData };
