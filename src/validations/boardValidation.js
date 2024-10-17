import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { BOARD_TYPES } from "~/utils/constants";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict().required(),
    userId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    backgroundColor: Joi.string().allow("", null).optional(),
    backgroundImage: Joi.string().allow(""),
    // description: Joi.string().min(3).max(250).trim().strict().required(),
    // type: Joi.string()
    //   .valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE)
    //   .required(),
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

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(250).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE),
  });

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
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

const moveCardToDifferentColumn = async (req, res, next) => {
  const correctCondition = Joi.object({
    currentCardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),

    prevColumnId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    prevCardOrderIds: Joi.array()
      .required()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      ),

    nextColumnId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    nextCardOrderIds: Joi.array()
      .required()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      ),
  });

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
    });
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

export const boardValidation = {
  createNew,
  update,
  moveCardToDifferentColumn,
};
