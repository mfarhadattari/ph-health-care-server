import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewServices } from './review.service';

/* --------------->> Create Review <<------------- */
const createReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.createReview(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Review created successfully',
    data: result,
  });
});

/* --------------->> Get My Review <<------------- */
const getMyReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.getMyReviews(req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Review retrieve successfully',
    data: result,
  });
});

export const ReviewControllers = {
  createReview,
  getMyReview,
};
