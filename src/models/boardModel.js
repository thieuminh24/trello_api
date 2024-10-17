import Joi from "joi";
import { ObjectId, ReturnDocument } from "mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { GET_DB } from "~/config/mongodb";
import { BOARD_TYPES } from "~/utils/constants";
import { columnModel } from "./columnModel";
import { cardModel } from "./cardModel";
import { userModel } from "./userModel";

const BOARD_COLLECTION_NAME = "boards";
// SCHEMA dùng để validate lại dữ liệu của tầng service truyền vào và thêm giá trị một số giá trị mặc định trước khi insert vào database
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().min(3).max(50).trim().strict().required(),
  slug: Joi.string().min(3).trim().strict().required(),
  // description: Joi.string().min(3).max(250).trim().strict(),
  // type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),
  userId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  backgroundColor: Joi.string().allow("", null).optional(),
  backgroundImage: Joi.string().allow(""),
  member: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  // backgroundColor: Joi.string().default("#2196f3"),
  // backgroundImage: Joi.string().default(
  //   "https://cdn.pixabay.com/photo/2016/06/02/02/33/triangles-1430105_1280.png"
  // ),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

// Chỉ định ra những Fields mà chúng ta không muốn cho phép cập nhật
const INVALID_UPDATE_FIELDS = ["_id", "createAt"];

// validate trước khi insert vào database
const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const createdBoard = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .insertOne(validData);
    return createdBoard;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// aggregate sẽ lấy những phần bản ghi trong collection .toArray sẽ trả ra một mảng chưa những phần tử có điều khiện
const getDetails = async (id) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        // lấy ra những giá bản ghi board chứa
        {
          $match: {
            _id: new ObjectId(id),
            _destroy: false,
          },
        },
        // tạo một mảng tên là columns và nó sẽ chứa những bản ghi columns có boardId bằng id của board
        {
          $lookup: {
            from: columnModel.COLUMN_COLLECTION_NAME,
            localField: "_id",
            foreignField: "boardId",
            as: "columns",
          },
        },
        // tạo một mảng tên là cards và nó sẽ chứa những bản ghi card có boardId bằng id của board

        {
          $lookup: {
            from: cardModel.CARD_COLLECTION_NAME,
            localField: "_id",
            foreignField: "boardId",
            as: "cards",
          },
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: "member",
            foreignField: "_id",
            as: "users",
          },
        },
      ])
      .toArray();
    return result[0] || null;
  } catch (error) {
    throw new Error(error);
  }
};

const pushColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(column.boardId) },
        { $push: { columnOrderIds: new ObjectId(column._id) } },
        { ReturnDocument: "after" } //return lại board sau khi đã chỉnh sửa
      );
    return result;
  } catch (error) {
    throw new error();
  }
};

const update = async (updateData, reqParam) => {
  try {
    //Lọc ra các trường không phép cập nhật như id và createdAt
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData(fieldName);
      }
    });
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(reqParam) },
        { $set: updateData },
        { ReturnDocument: "after" } //return lại board sau khi đã chỉnh sửa
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllBoard = async (userId, page, limit) => {
  try {
    const skip = (page - 1) * limit;
    const Myboard = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .find({ userId: userId })
      .limit(limit * 1)
      .skip(skip)
      .toArray();

    const JoinedBoard = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .find({ member: { $in: [new ObjectId(userId)] } })
      .limit(limit * 1)
      .skip(skip)
      .toArray();

    const result = {
      Myboard,
      JoinedBoard,
    };

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const searchBoard = async (searchData, userId) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .find({ title: { $regex: searchData, $options: "i" }, userId })
      .toArray();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnOrderIds,
  update,
  getAllBoard,
  searchBoard,
};
