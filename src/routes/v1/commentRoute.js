import express from "express";
import commentController from "~/controllers/commentController";
import authMiddleware from "~/middlewares/authMiddleware";
import commentModel from "~/models/commentModel";
const Router = express.Router();

Router.route("/").post(authMiddleware.verifyToken, commentController.createNew);

Router.route("/:cardId").get(
  authMiddleware.verifyToken,
  commentController.getAllByIdCard
);

export const commentRouter = Router;
