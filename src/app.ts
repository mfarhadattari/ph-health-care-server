import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import cron from "node-cron";
import config from "./app/config";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFoundHandler from "./app/middlewares/notFoundHandler";
import { AppointmentServices } from "./app/modules/appointment/appointment.service";
import router from "./app/routes";

const app: Application = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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

// application route
app.use("/api", router);

// Schedule to run every minute
cron.schedule("* * * * *", async () => {
  try {
    await AppointmentServices.cancelUnpaidAppointments();
  } catch (error) {
    console.error("Failed");
  }
});

// global error handler
app.use(globalErrorHandler);

// not found handler
app.use(notFoundHandler);

export default app;
