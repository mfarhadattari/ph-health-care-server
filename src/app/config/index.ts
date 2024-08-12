import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  port: process.env.PORT,
  app_name: process.env.APP_NAME,
  node_env: process.env.NODE_ENV,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET as string,
  access_token_expires: process.env.ACCESS_TOKEN_EXPIRES as string,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET as string,
  refresh_token_expires: process.env.REFRESH_TOKEN_EXPIRES as string,
};

export default config;
