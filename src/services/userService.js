import { columnModel } from "~/models/columnModel";
import { userModel } from "~/models/userModel";

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newUser = {
      ...reqBody,
    };

    const createdUser = await userModel.createNew(newUser);

    return createdUser;
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
};
