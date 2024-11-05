import express from "express";
import {
  register,
  login,
  loginFacebook,
  extendToken,
  loginAsyncKey,
  forgotPass,
  changePass,
} from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login); // login bằng khoá đối xứng
authRoutes.post("/login-face", loginFacebook);
authRoutes.post("/extend-token", extendToken);
authRoutes.post("/login-async-key", loginAsyncKey); // login bằng khoá bất đối xứng
authRoutes.post("/forgot-password", forgotPass); // API quên mật khẩu: gửi code qua mail
authRoutes.post("/change-password", changePass);

export default authRoutes;
