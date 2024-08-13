import { RequestHandler } from "express";

const bodyParser: RequestHandler = async (req, res, next) => {
  try {
    req.body = await JSON.parse(req.body.data);
    next();
  } catch (error) {
    next(error);
  }
};

export default bodyParser;
