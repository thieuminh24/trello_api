import { StatusCodes } from "http-status-codes";
import { userService } from "~/services/userService";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import generateAccessToken from "~/utils/generateAccessToken";
import decodeToken from "~/utils/decodeToken";
import { userModel } from "~/models/userModel";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMPT_MAIL,
    pass: process.env.SMPT_PASSWORD,
  },
});

const createNew = async (req, res, next) => {
  try {
    const { email, firstName, lastName } = req.body;
    const createdUser = await userService.createNew(req.body);
    const { insertedId } = createdUser;
    const result = generateAccessToken(insertedId);
    const token = result.split(".")[1];

    const activationLink = `${process.env.CLIENT_URL}/activate/${token}`;
    const mailOption = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Account Activation Link",
      html: ` <h1>Hello ${firstName} ${lastName}</h1>
     <img
          style="
              width: 250px; 
              height: 250px;
              object-fit: cover;
          "
          src="https://static.vecteezy.com/system/resources/previews/008/574/230/non_2x/hello-letters-with-hand-logo-template-palm-logo-concept-for-friendly-business-identity-poster-banner-illustration-vector.jpg"
      />
        <p>Vui lòng nhấp vào link dưới đây để kích hoạt tài khoản của bạn:</p>
        
        <a href="${activationLink}" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #007BFF; /* Màu nền xanh */
          color: white;              /* Màu chữ trắng */
          text-align: center;        /* Căn giữa chữ */
          text-decoration: none;     /* Bỏ gạch chân */
          border: none;              /* Bỏ viền */
          border-radius: 5px;       /* Bo tròn góc */
          font-size: 16px;           /* Kích thước chữ */
          transition: background-color 0.3s; /* Hiệu ứng chuyển màu */
        "
        onmouseover="this.style.backgroundColor='#0056b3'" 
        onmouseout="this.style.backgroundColor='#007BFF'">
          Xác nhận tài khoản
        </a>
        <p>Link sẽ hết hạn sau 1 giờ.</p>`,
    };

    transporter.sendMail(mailOption);
    res.status(StatusCodes.CREATED).json({
      message:
        "Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.",
      token: result,
    });
  } catch (error) {
    next(error);
  }
};

const activeToken = async (req, res, next) => {
  const { token } = req.body;

  try {
    const userId = decodeToken(token);
    // console.log(userId);
    const user = await userModel.findOneById(userId);
    // console.log("hello", user);
    if (!user) {
      throw new Error("User not fond");
    }
    const result = await userModel.updateOne(userId);
    res.status(200).json({ message: "Cập nhật thành công" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  // const { email, password } = req.body;
  try {
    const user = await userModel.auth(req.body);
    const token = generateAccessToken(user._id);

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true, // Không cho phép JavaScript truy cập cookie
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        secure: true,
        sameSite: "none",
      })
      .json({
        userId: user._id,
        message: "Login Success",
      });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ message: "Logged out!" });
};

const verify = async (req, res) => {
  res.status(200).json({ message: "success" });
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.payload;
    const User = await userModel.findOneById(id);
    res.status(200).json(User);
  } catch (error) {
    next(error);
  }
};
export const userController = {
  createNew,
  activeToken,
  login,
  logout,
  verify,
  getUser,
};
