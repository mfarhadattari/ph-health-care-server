/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import axios from 'axios';
import httpStatus from 'http-status';
import config from '../config';
import AppError from '../error/AppError';

const initPayment = async (payload: {
  customerName: string;
  customerEmail: string;
  customerContract: string;
  address?: string;
  amount: number;
  transactionId: string;
}) => {
  try {
    const data = {
      store_id: config.ssl_store_id,
      store_passwd: config.ssl_store_pass,
      total_amount: payload.amount,
      currency: 'BDT',
      tran_id: payload.transactionId,
      success_url: config.pay_success,
      fail_url: config.pay_fail,
      cancel_url: config.pay_cancel,
      ipn_url: `${config.server_base_url}/payment/ipn`,
      shipping_method: 'N/A',
      product_name: 'Doctor Appointment',
      product_category: 'Appointment',
      product_profile: 'Service',
      cus_name: payload.customerName,
      cus_email: payload.customerEmail,
      cus_add1: payload.address || 'N/A',
      cus_phone: payload.customerContract,
      cus_city: 'N/A',
      cus_state: 'N/A',
      cus_postcode: 'N/A',
      cus_country: 'N/A',
      ship_name: 'N/A',
      ship_add1: 'N/A',
      ship_add2: 'N/A',
      ship_city: 'N/A',
      ship_state: 'N/A',
      ship_postcode: 'N/A',
      ship_country: 'N/A',
    };
    const response = await axios({
      method: 'post',
      url: config.ssl_session_api,
      data: data,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (response.data.status === 'SUCCESS') {
      return response.data;
    } else {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Payment Failed');
    }
  } catch (err: any) {
    throw new AppError(httpStatus.BAD_REQUEST, err.message);
  }
};

const validatePayment = async (data: any) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${config.ssl_valid_api}?val_id=${data.val_id}&store_id=${config.ssl_store_id}&store_passwd=${config.ssl_store_pass}&format=json`,
    });
    return response.data;
  } catch (err: any) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Payment error');
  }
};

export const sslPay = {
  initPayment,
  validatePayment,
};
