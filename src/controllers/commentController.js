import { ObjectId } from "mongodb";

const { default: commentModel } = require("~/models/commentModel");

const createNew = async (req, res, next) => {
  try {
    const result = await commentModel.createNew(req.body);

    const commentInsert = await commentModel.findOneById(result.insertedId);

    res.status(200).json(commentInsert);
  } catch (error) {
    next(error);
  }
};

const getAllByIdCard = async (req, res, next) => {
  const { cardId } = req.params;

  try {
    const result = await commentModel.getAllCommentByCardId(cardId);

    res.status(200).json(result);
    return cardId;
  } catch (error) {
    next(error);
  }
};

export default { createNew, getAllByIdCard };
