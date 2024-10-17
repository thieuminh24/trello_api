import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateAccessToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_ACCESS_KEY, {
    expiresIn: process.env.JWT_ACCESS_KEY_EXPIRE_TIME,
  });

  return token;
};

export default generateAccessToken;
