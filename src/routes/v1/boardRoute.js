import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardController } from "~/controllers/boardController";
import authMiddleware from "~/middlewares/authMiddleware";
import { boardValidation } from "~/validations/boardValidation";

const Router = express.Router();

Router.route("/search").get(
  authMiddleware.verifyToken,
  boardController.searchBoard
);

Router.route("/getAllBoard/:userId").get(
  authMiddleware.verifyToken,
  boardController.getAll
);

Router.route("/")
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: "GET: Api get list board" });
  })
  .post(boardValidation.createNew, boardController.createNew);

Router.route("/:id")
  .get(boardController.getDetails)
  .put(boardValidation.update, boardController.update);

// Api hỗ trợ việc di chuyển card giữa các column khác nhau trong một board
Router.route("/supports/moving_cards").put(
  boardValidation.moveCardToDifferentColumn,
  boardController.moveCardToDifferentColumn
);

export const boardRoutes = Router;
