import { cardModel } from "~/models/cardModel";
import { columnModel } from "~/models/columnModel";

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newCard = {
      ...reqBody,
    };

    // Gọi tới tầng Model để xử lý bản ghi newcard và trong Database
    const createdCard = await cardModel.createNew(newCard);
    //Gọi tới tầng Model để lấy ra một bản ghi dựa trên id được truyền vào
    const getNewcard = await cardModel.findOneById(createdCard.insertedId);

    if (getNewcard) {
      await columnModel.pushCardOrderIds(getNewcard);
    }

    return getNewcard;
  } catch (error) {
    throw error;
  }
};

export const cardService = {
  createNew,
};
