/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

//thieuquangminh2422
//NdWxQKokuvIXFA2C

import { env } from "~/config/environment";

import { MongoClient, ServerApiVersion } from "mongodb";

let trelloDatabaseInstance = null;

// Khởi tại một đối tượng mongoInstance để connect tới MongoDB
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect();

  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME);
};

// Lấy ra database
export const GET_DB = () => {
  if (!trelloDatabaseInstance)
    throw new Error("Must connect to Database first!");
  return trelloDatabaseInstance;
};

export const CLOSE_DB = async () => {
  await mongoClientInstance.close();
};
