import Joi from "joi";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { cloneDeep } from "lodash";

// const INVALID_UPDATE_FIELDS = ["_id", "createAt", "boardId"];

// Define Collection (name & schema)
const USER_COLLECTION_NAME = "users";
const USER_COLLECTION_SCHEMA = Joi.object({
  firstName: Joi.string().min(2).max(50).trim().strict().required(),
  lastName: Joi.string().min(2).max(50).trim().strict().required(),
  boardIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  email: Joi.string().min(3).max(250).trim().strict().required(),
  password: Joi.string().min(8).trim().strict().required(),
  isActive: Joi.boolean().default(false),
  avatar: Joi.string().default(""),
  gender: Joi.number().default(null),
  phone: Joi.string().default(""),
  jobTitle: Joi.string().default(""),
  department: Joi.string().default(""),
  organization: Joi.string().default(""),
  socketId: Joi.string().default(null),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);

    validData.password = await bcrypt.hash(validData.password, 10);
    const newUserToAdd = {
      ...validData,
    };
    const createdUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(newUserToAdd);
    return createdUser;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (id, data) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .updateOne(
        {
          _id: new ObjectId(id),
        },
        { $set: data }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const user = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

const updateOne = async (id) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .updateOne(
        {
          _id: new ObjectId(id),
        },
        { $set: { isActive: true } }
      );
  } catch (error) {
    throw new Error(error);
  }
};

const auth = async (data) => {
  try {
    const user = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ email: data.email });

    if (!user) {
      throw new Error("Please provide the correcr infomation", 400);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (isPasswordValid === false) {
      throw new Error("Please provide the correcr infomation", 400);
    }
    const resUser = cloneDeep(user);
    delete resUser.password;
    return resUser;
  } catch (error) {
    throw new Error(error);
  }
};

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  auth,
  findOneById,
  update,
  updateOne,
};
