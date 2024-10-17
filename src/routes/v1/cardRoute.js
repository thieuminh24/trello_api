import express from "express";
import upload from "~/config/cloudinary";
import { cardController } from "~/controllers/cardController";
import authMiddleware from "~/middlewares/authMiddleware";
import { cardValidation } from "~/validations/cardValidation";

const Router = express.Router();

Router.route("/dowload").get((req, res) => {
  const fileUrl = req.query.url;
  const originalFileName = req.query.name;

  res.set({
    "Content-Disposition": `attachment; filename="${originalFileName}"`,
  });

  res.redirect(fileUrl);
});

Router.route("/:id").put(
  authMiddleware.verifyToken,
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "files", maxCount: 5 },
  ]),
  cardController.updateOneById
);

Router.route("/").post(cardValidation.createNew, cardController.createNew);
Router.route("/:id").get(authMiddleware.verifyToken, cardController.getOne);

export const cardRoutes = Router;
