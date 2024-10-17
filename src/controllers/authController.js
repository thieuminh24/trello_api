import { StatusCodes } from "http-status-codes";
import { authService } from "~/services/authService";

const resgister = async (req, res, next) => {
  try {
    const user = await authService.resgister(req.body);

    res.status(StatusCodes.CREATED).json(user);
  } catch (error) {
    next(error);
  }
};

export const authController = { resgister };
