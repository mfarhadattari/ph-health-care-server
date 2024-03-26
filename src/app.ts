import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { AppRoutes } from "./app/routes";

const app: Application = express();
export const prisma = new PrismaClient();

app.use(cors());

// parser
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// base route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "PH Health Care Server Running",
    data: null,
  });
});

// application routes
app.use("/api/v1", AppRoutes);

export default app;
