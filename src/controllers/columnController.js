import { StatusCodes } from "http-status-codes";
import { columnService } from "~/services/columnService";
import ApiError from "~/utils/ApiError";

const createNew = async (req, res, next) => {
  try {
    const createdColumn = await columnService.createNew(req.body);

    res.status(StatusCodes.CREATED).json(createdColumn);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const updateColumn = await columnService.update(req.params.id, req.body);

    res.status(StatusCodes.OK).json(updateColumn);
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const result = await columnService.deleteItem(req.params.id);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const columnController = { createNew, update, deleteItem };
