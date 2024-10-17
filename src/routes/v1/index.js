import express from "express";

const Router = express.Router();
import { StatusCodes } from "http-status-codes";
import { boardRoutes } from "./boardRoute";
import { columnRoutes } from "./columnRoute";
import { cardRoutes } from "./cardRoute";
import { userRoutes } from "./userRoutes";
import { commentRouter } from "./commentRoute";

Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "Api v1 are ready to use" });
});

Router.use("/user/", userRoutes);

// Boards API
Router.use("/boards", boardRoutes);

// Column API
Router.use("/columns", columnRoutes);

// Column API
Router.use("/cards", cardRoutes);

//Comment API
Router.use("/comments", commentRouter);

export const APIs_V1 = Router;
