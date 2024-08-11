import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  port: process.env.PORT,
  app_name: process.env.APP_NAME,
  node_env: process.env.NODE_ENV,
};

export default config;
