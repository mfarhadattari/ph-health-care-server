import cors from "cors";
import express, { Application, Request, Response } from "express";

const app: Application = express();

app.use(cors());

// parser
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "PH Health Care Server Running",
    data: null,
  });
});

export default app;
