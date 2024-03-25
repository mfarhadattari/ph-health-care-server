import dotenv from "dotenv";
import path from "path";
import { cwd } from "process";

dotenv.config({ path: path.join(cwd(), ".env") });

const config = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
};

export default config;
