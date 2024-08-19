/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import nodemailer from 'nodemailer';
import config from '../config';
import AppError from '../error/AppError';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: config.nodemailer_email,
    pass: config.nodemailer_secret,
  },
});

const sendMail = async (payload: {
  receiver: string;
  subject: string;
  bodyHtml: string;
}) => {
  try {
    await transporter.sendMail({
      from: `"PH Health Care" <${config.nodemailer_email}>`,
      to: payload.receiver,
      subject: payload.subject,
      html: payload.bodyHtml,
    });
  } catch (error: any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export default sendMail;
