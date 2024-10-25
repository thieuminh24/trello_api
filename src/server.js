import express from "express";
import cors from "cors";
import exitHook from "async-exit-hook";
import { CONNECT_DB, GET_DB, CLOSE_DB } from "~/config/mongodb";
import "dotenv/config";
import { env } from "~/config/environment";
import { APIs_V1 } from "./routes/v1/index";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import { corsOptions } from "./config/cors";
import cookieParser from "cookie-parser";
import { userModel } from "./models/userModel";
import { ObjectId } from "mongodb";
import { boardModel } from "./models/boardModel";
const http = require("http");
const { Server } = require("socket.io");
const BOARD_COLLECTION_NAME = "boards";
const hostname = process.env.APP_HOST;
const port = process.env.APP_PORT;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowEIO3: true,
  },
});

const START_SERVER = () => {
  // Xử lý cors
  app.use(
    cors({
      origin:
        //"https://trello-front-end-git-master-thieuminh24s-projects.vercel.app",
        process.env.CLIENT_URL,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use("/v1", APIs_V1);

  app.use(errorHandlingMiddleware);

  //Socket
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    // Lưu socketId vào database
    socket.on("saveSocketId", async (userId) => {
      try {
        // Cập nhật socketId cho user
        const result = await GET_DB()
          .collection("users")
          .updateOne(
            {
              _id: new ObjectId(userId),
            },
            { $set: { socketId: socket.id } }
          );
      } catch (error) {
        console.error("Error updating socket ID:", error);
      }
    });

    socket.on("sendNotification", async ({ email, name, boardId }) => {
      const result = await GET_DB().collection("users").findOne({ email });

      const message = `${name} muốn mời bạn và board của họ`;

      io.to(result.socketId).emit("receiveNotification", { message, boardId });
    });

    socket.on("acceptInvite", async ({ userId, boardIdInvite }) => {
      const board = await boardModel.findOneById(boardIdInvite);

      const userSendInvite = await GET_DB()
        .collection("users")
        .findOne({ _id: new ObjectId(board.userId) });

      if (board.member.includes(userId) === false) {
        board.member.push(new ObjectId(userId));
        const message = "Invitation has been accepted";
        socket.to(userSendInvite.socketId).emit("responseInvite", message);
      }
      const result = await GET_DB()
        .collection(BOARD_COLLECTION_NAME)
        .findOneAndUpdate(
          { _id: new ObjectId(boardIdInvite) },
          { $set: board },
          { ReturnDocument: "after" } //return lại board sau khi đã chỉnh sửa
        );

      return result;
    });

    socket.on("itemIsDragging", (id) => {
      socket.broadcast.emit("itemIsDragging", id);
    });

    socket.on("newColumnsAfterSort", (data) => {
      socket.broadcast.emit("newColumnsAfterSort", data);
    });

    socket.on("newColumnsAfterSort", (data) => {
      socket.broadcast.emit("newColumnsAfterSort", data);
    });

    socket.on("addNewColumn", (data) => {
      socket.broadcast.emit("addNewColumn", data);
    });

    socket.on("deleteColumn", (data) => {
      socket.broadcast.emit("deleteColumn", data);
    });

    socket.on("addNewCard", (data) => {
      socket.broadcast.emit("addNewCard", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });

  server.listen(port, () => {
    console.log(`Hello Thieu Minh, I am running at ${hostname}:${port}/`);
  });

  exitHook(() => {
    CLOSE_DB();
  });
};

(async () => {
  try {
    await CONNECT_DB();

    console.log("Connect to MongoDB Cloud Atlas");
    START_SERVER();
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
})();
