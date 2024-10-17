import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const decodeToken = (token) => {
  const user = jwt.verify(token, process.env.JWT_ACCESS_KEY);
  return user.id;
};
export default decodeToken;
