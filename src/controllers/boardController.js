import { StatusCodes } from "http-status-codes";
import { boardModel } from "~/models/boardModel";
import { boardService } from "~/services/boardService";
import ApiError from "~/utils/ApiError";

const createNew = async (req, res, next) => {
  try {
    // điều hướng dữ liệu sang tầng service
    const createdBoard = await boardService.createNew(req.body);

    //có kết quả thì trả về phía client
    res.status(StatusCodes.CREATED).json(createdBoard);
  } catch (error) {
    next(error);
  }
};

const getDetails = async (req, res, next) => {
  try {
    // điều hướng dữ liệu sang tầng service
    const getDetails = await boardService.getDetails(req.params.id);

    res.status(StatusCodes.OK).json(getDetails);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    // điều hướng dữ liệu sang tầng service
    const updateBoard = await boardService.update(req.body, req.params.id);

    //có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(updateBoard);
  } catch (error) {
    next(error);
  }
};

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    // điều hướng dữ liệu sang tầng service
    const updateBoard = await boardService.moveCardToDifferentColumnAPI(
      req.body
    );

    //có kết quả thì trả về phía client
    res.status(StatusCodes.OK).json(updateBoard);
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 9 } = req.query;
    const { userId } = req.params;

    const result = await boardModel.getAllBoard(userId, page, limit);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const searchBoard = async (req, res, next) => {
  const { query, userId } = req.query;
  try {
    const result = await boardModel.searchBoard(query, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getAll,
  searchBoard,
};
