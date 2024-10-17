import { StatusCodes } from "http-status-codes";
import { cardModel } from "~/models/cardModel";
import { cardService } from "~/services/cardService";
import { v4 as uuidv4 } from "uuid";

const createNew = async (req, res, next) => {
  try {
    const createdCard = await cardService.createNew(req.body);

    res.status(StatusCodes.CREATED).json(createdCard);
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await cardModel.findOneByIdDetail(id);
    console.log(result);
    if (!result) {
      next(new Error("Card not fond !"));
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateOneById = async (req, res, next) => {
  const { id } = req.params;
  let result;
  try {
    if (req?.files) {
      if (req?.files["cover"]) {
        result = await cardModel.update(id, {
          cover: req.files["cover"][0].path,
        });
        res.status(200).json(result);
      } else if (req?.files["files"]) {
        const fileDetails = req.files["files"].map((file) => ({
          id: uuidv4(),
          url: file.path,
          originalFileName: file.originalname,
          originalFileType: file.mimetype,
          uploadDate: new Date(),
        }));
        const paths = req.files["files"].map((i) => i.path);
        result = await cardModel.update(id, {
          files: fileDetails,
        });

        res.status(200).json(result);
      }
    }
    if (req.body) {
      result = await cardModel.update(id, req.body);
      res.status(200).json(result);
    }
  } catch (error) {
    next(error);
  }
};

export const cardController = { createNew, getOne, updateOneById };
