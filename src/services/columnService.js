import { columnModel } from "~/models/columnModel";
import { boardModel } from "~/models/boardModel";
import { cardModel } from "~/models/cardModel";

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newColumn = {
      ...reqBody,
    };

    // Gọi tới tầng Model để xử lý bản ghi newcolumn và trong Database
    const createdColumn = await columnModel.createNew(newColumn);
    //Gọi tới tầng Model để lấy ra một bản ghi dựa trên id được truyền vào
    const getNewColumn = await columnModel.findOneById(
      createdColumn.insertedId
    );

    if (getNewColumn) {
      getNewColumn.cards = [];
      await boardModel.pushColumnOrderIds(getNewColumn);
    }

    return getNewColumn;
  } catch (error) {
    throw error;
  }
};

const update = async (reqParam, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updateData = {
      ...reqBody,
      updateAt: Date.now(),
    };

    const updateColumns = await columnModel.update(reqParam, updateData);
    return updateColumns;
  } catch (error) {
    throw error;
  }
};

const deleteItem = async (columnId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Xóa column
    await columnModel.deleteOneById(columnId);
    //Xóa toàn bộ card thuộc column trên
    await cardModel.deleteManyByColumnId(columnId);

    return { deleteResult: "Column and its Cards deleted successfully" };
  } catch (error) {
    throw error;
  }
};

export const columnService = {
  createNew,
  update,
  deleteItem,
};
