import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = {
  verifyToken: (req, res, next) => {
    const token = req.cookies.token; // Lấy token từ cookie

    if (!token) {
      next(new Error("Token not fond!"));
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_KEY);
      req.payload = payload;
      next();
    } catch (error) {
      return res.status(500).json({ message: error.message }); // Gọi lỗi nếu token không hợp lệ
    }
  },

  verifyAdmin: {},
};

export default authMiddleware;
