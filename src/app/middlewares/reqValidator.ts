import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const reqValidator = (validationSchema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validationSchema.parseAsync({
        body: req.body,
      });
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default reqValidator;
