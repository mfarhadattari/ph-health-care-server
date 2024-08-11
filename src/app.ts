import cors from "cors";
import express, { Application } from "express";
import config from "./app/config";

const app: Application = express();

// middleware
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "PH Health Care Server Running",
    data: {
      name: config.app_name,
      env: config.node_env,
      port: config.port,
    },
  });
});

export default app;
