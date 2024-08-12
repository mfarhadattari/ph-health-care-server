import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

/* -------------->> Login User <<------------ */
const loginUser = catchAsync(async (req, res) => {
  const { refreshToken, ...result } = await AuthServices.loginUser(req.body);

  res.cookie(`${config.app_name}-token`, refreshToken, {
    httpOnly: true,
    secure: true,
  });

  sendResponse(res, {
    statusCode: 200,
    message: "User logged in successfully",
    data: result,
  });
});

export const AuthControllers = { loginUser };
