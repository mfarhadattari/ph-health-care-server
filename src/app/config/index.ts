import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

const config = {
  port: process.env.PORT,
  app_name: process.env.APP_NAME,
  node_env: process.env.NODE_ENV,
  super_email: process.env.SUPER_EMAIL as string,
  super_pass: process.env.SUPER_PASS as string,
  client_base_url: process.env.CLIENT_BASE_URL,
  server_base_url: process.env.SERVER_BASE_URL,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET as string,
  access_token_expires: process.env.ACCESS_TOKEN_EXPIRES as string,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET as string,
  refresh_token_expires: process.env.REFRESH_TOKEN_EXPIRES as string,
  reset_token_secret: process.env.RESET_TOKEN_SECRET as string,
  reset_token_expires: process.env.RESET_TOKEN_EXPIRES as string,
  nodemailer_email: process.env.NODEMAILER_EMAIL,
  nodemailer_secret: process.env.NODEMAILER_SECRET,
  cloud_cloud_name: process.env.CLOUD_CLOUD_NAME,
  cloud_api_key: process.env.CLOUD_API_KEY,
  cloud_api_secret: process.env.CLOUD_API_SECRET,
  ssl_store_id: process.env.SSL_STORE_ID,
  ssl_store_pass: process.env.SSL_STORE_PASS,
  ssl_session_api: process.env.SSL_SESSION_API,
  ssl_valid_api: process.env.SSL_VALID_API,
  pay_success: process.env.PAY_SUCCESS,
  pay_fail: process.env.PAY_FAIL,
  pay_cancel: process.env.PAY_CANCEL,
};

export default config;
