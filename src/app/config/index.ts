import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  port: process.env.PORT,
  app_name: process.env.APP_NAME,
  node_env: process.env.NODE_ENV,
  client_base_url: process.env.CLIENT_BASE_URL,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET as string,
  access_token_expires: process.env.ACCESS_TOKEN_EXPIRES as string,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET as string,
  refresh_token_expires: process.env.REFRESH_TOKEN_EXPIRES as string,
  reset_token_secret: process.env.RESET_TOKEN_SECRET as string,
  reset_token_expires: process.env.RESET_TOKEN_EXPIRES as string,
  nodemailer_email: process.env.NODEMAILER_EMAIL,
  nodemailer_secret: process.env.NODEMAILER_SECRET,
};

export default config;
