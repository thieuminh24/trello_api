import express from "express";
import { userController } from "~/controllers/userController";
import authMiddleware from "~/middlewares/authMiddleware";
import { authValidation } from "~/validations/authValidation";
import { userValidation } from "~/validations/userValidation";

const Router = express.Router();

Router.route("/register").post(
  userValidation.createNew,
  userController.createNew
);

Router.route("/login").post(authValidation.auth, userController.login);
Router.route("/logout").get(authMiddleware.verifyToken, userController.logout);

Router.route("/protected").get(
  authMiddleware.verifyToken,
  userController.verify
);

Router.route("/active/:active_token").get(userController.activeToken);
Router.route("/update").put(authMiddleware.verifyToken, userController.update);
Router.route("/").get(authMiddleware.verifyToken, userController.getUser);

// Router.route("/register").post(authValidation.auth, authController.resgister);

export const userRoutes = Router;
