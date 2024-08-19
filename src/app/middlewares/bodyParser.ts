import { RequestHandler } from 'express';

const bodyParser: RequestHandler = async (req, res, next) => {
  try {
    if (req.body.data) {
      req.body = await JSON.parse(req.body.data);
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default bodyParser;
