import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    firstName: Joi.string().min(2).max(50).trim().strict().required(),
    lastName: Joi.string().min(2).max(50).trim().strict().required(),
    email: Joi.string().min(3).max(250).trim().strict().required(),
    password: Joi.string().min(8).trim().strict().required(),
    socketId: Joi.string().default(null),
    createdAt: Joi.date().timestamp("javascript").default(Date.now),
    updatedAt: Joi.date().timestamp("javascript").default(null),
    _destroy: Joi.boolean().default(false),
  });

  try {
    //validateAsync sẽ trả ra một promise
    //Promise sẽ được giải quyết (resolved) và trả về đối tượng đã được kiểm tra, tức là req.body đã được xác nhận hợp lệ.
    //Promise sẽ bị từ chối (rejected) và trả về một đối tượng lỗi (error object) chứa thông tin về các lỗi validation.
    // abortEarly: false trường hợp có nhiều lỗi validation thì trả về tất cả lỗi
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    // Validate xong xuôi hợp lệ thì cho request đi tiếp
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

export const userValidation = {
  createNew,
};
