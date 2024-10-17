import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

const auth = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().min(3).max(250).trim().strict().required(),
    password: Joi.string().min(8).trim().strict().required(),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (error) {
    const errorMessage = new Error(error).message;
    const customMessage = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      errorMessage
    );
    next(customMessage);
  }
};

export const authValidation = {
  auth,
};
