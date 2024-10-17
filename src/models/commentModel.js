import { ObjectId } from "mongodb";
import { userModel } from "./userModel";

const Joi = require("joi");
const { GET_DB } = require("~/config/mongodb");
const {
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} = require("~/utils/validators");

const COMMENT_COLLECTION_NAME = "comments";

const BOARD_COLLECTION_SCHEMA = Joi.object({
  content: Joi.string().required(),
  userId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  cardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const INVALID_UPDATE_FIELDS = ["_id", "createAt"];

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false, //{ abortEarly: false }: Tùy chọn này chỉ định rằng Joi không nên dừng lại ở lỗi đầu tiên tìm thấy. Khi abortEarly là false, hàm sẽ tiếp tục kiểm tra tất cả các trường và trả về tất cả các lỗi (nếu có) thay vì chỉ trả về lỗi đầu tiên.
  });
};

const createNew = async (data) => {
  try {
    const validDta = await validateBeforeCreate(data);
    const { content, userId, boardId, cardId } = validDta;
    const commentDataSave = {
      ...validDta,
      content,
      userId: new ObjectId(userId),
      boardId: new ObjectId(boardId),
      cardId: new ObjectId(cardId),
    };
    const result = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .insertOne(commentDataSave);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
            _destroy: false,
          },
        },

        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: "userId",
            foreignField: "_id",
            as: "users",
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllCommentByCardId = async (cardId) => {
  try {
    const result = await GET_DB()
      .collection(COMMENT_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            cardId: new ObjectId(cardId),
            _destroy: false,
          },
        },

        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: "userId",
            foreignField: "_id",
            as: "users",
          },
        },
      ])
      .toArray();

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  createNew,
  findOneById,
  getAllCommentByCardId,
};
