import {
  createRefToken,
  createRefTokenAsyncKey,
  createToken,
  createTokenAsyncKey,
} from "../config/jwt.js";
import transporter from "../config/transporter.js";
import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // lib để tạo random code cho flow forgot password
import code from "../models/code.js";

const model = initModels(sequelize);

const register = async (req, res, next) => {
  try {
    const { fullName, email, pass } = req.body;
    console.log({ fullName, email, pass });
    // const userExist = model.users.findOne({
    //    where: {
    //       email: email,
    //    },
    // });
    // console.log({ userExist });
    // if (userExist) {
    //    return res.status(400).json({ message: `Tài khoản đã tồn tại`, data: null });
    // }

    const userNew = await model.users.create({
      full_name: fullName,
      email: email,
      pass_word: bcrypt.hashSync(pass, 10),
    });

    // cấu hình info email
    const mailOption = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Welcome to Our service",
      text: `Hello ${fullName}. Best Regards.`,
      html: `<h1>Ahihi đồ ngốc</h1>`,
    };

    // gửi mail
    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        return res.status(500).json({ message: "Sending email error" });
      }
      return res.status(200).json({
        message: "Đăng ký thành công",
        data: userNew,
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};

const login = async (req, res) => {
  try {
    // b1: lấy email và pass_word từ body request
    // b2: check user thông qua email (get user từ db)
    //   b2.1: nếu không có user => ra error user not found
    //   b2.2: nếu có user => check tiếp pass_word
    //     b2.2.1: nếu password không trùng nhau => ra error password is wrong
    //     b2.2.2: nếu password trùng nhau => tạo access token
    let { email, pass_word } = req.body;
    let user = await model.users.findOne({
      where: { email },
    });
    if (!user) {
      return res.status(400).json({ message: "Email is wrong" });
    }
    let checkPass = bcrypt.compareSync(pass_word, user.pass_word);
    if (!checkPass) {
      return res.status(400).json({ message: "Password is wrong" });
    }
    let payload = { userId: user.user_id };
    // tạo token
    // funtion sign của jwt
    // param 1: tạo payload và lưu vào token
    // param 2: key để tạo ra token
    // param 3: setting lifetime của token và thuật toán để tạo token
    // let accessToken = jwt.sign({ payload }, "NODE44", {
    //    algorithm: "HS256",
    //    expiresIn: "1d",
    // });
    let accessToken = createToken({ userId: user.user_id });
    // tạo refresh token
    let refreshToken = createRefToken({ userId: user.user_id });
    // lưu refresh token vào database
    await model.users.update(
      {
        refresh_token: refreshToken,
      },
      {
        where: { user_id: user.user_id },
      }
    );

    // lưu refresh token vào cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // cookie không thể truy cập được từ javascript để bảo mật
      secure: false, // dùng cho localhost, nếu chạy https thì phải set là true
      sameSite: "Lax", // đảm bảo cookie được gửi trong nhiều domain khác nhau
      maxAge: 7 * 24 * 60 * 60 * 1000, // thời gian tồn tại là 7 ngày
    });

    return res.status(200).json({
      message: "Login successfully",
      data: accessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};

const loginFacebook = async (req, res) => {
  try {
    // b1: lấy id, email, name từ request
    // b2: check id (app_face_id trong db)
    // b2.1 nếu có app_face_id => tạo access token => gửi về cho FE
    // b2.2 nếu không có app_face_id => tạo user mới => gửi về cho FE
    let { id, email, name } = req.body;
    let user = await model.users.findOne({
      where: { face_app_id: id },
    });
    if (!user) {
      let newUser = {
        full_name: name,
        face_app_id: id,
        email,
      };
      user = await model.users.create(newUser);
    }
    let accessToken = jwt.sign({ userId: user.user_id }, "NODE44", {
      algorithm: "HS256",
      expiresIn: "1d",
    });
    return res.status(200).json({
      message: "Login successfully",
      data: accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
};

const extendToken = async (req, res) => {
  try {
    // lấy refresh token từ cookie của request
    let refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401);
    }
    // check refresh token trong database
    let userRefToken = await model.users.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!userRefToken) {
      return res.status(401);
    }
    // let newAccessToken = createToken({ userId: userRefToken.user_id });
    let newAccessToken = createTokenAsyncKey({ userId: userRefToken.user_id });
    return res.status(200).json({ message: "Success", data: newAccessToken });
  } catch (error) {
    return res.status(501).json({ message: "error" });
  }
};

const loginAsyncKey = async (req, res) => {
  try {
    // b1: lấy email và pass_word từ body request
    // b2: check user thông qua email (get user từ db)
    //   b2.1: nếu không có user => ra error user not found
    //   b2.2: nếu có user => check tiếp pass_word
    //     b2.2.1: nếu password không trùng nhau => ra error password is wrong
    //     b2.2.2: nếu password trùng nhau => tạo access token
    let { email, pass_word } = req.body;
    let user = await model.users.findOne({
      where: { email },
    });
    if (!user) {
      return res.status(400).json({ message: "Email is wrong" });
    }
    let checkPass = bcrypt.compareSync(pass_word, user.pass_word);
    if (!checkPass) {
      return res.status(400).json({ message: "Password is wrong" });
    }
    let payload = { userId: user.user_id };
    // tạo token
    // funtion sign của jwt
    // param 1: tạo payload và lưu vào token
    // param 2: key để tạo ra token
    // param 3: setting lifetime của token và thuật toán để tạo token
    // let accessToken = jwt.sign({ payload }, "NODE44", {
    //    algorithm: "HS256",
    //    expiresIn: "1d",
    // });
    let accessToken = createTokenAsyncKey({ userId: user.user_id });
    // tạo refresh token
    let refreshToken = createRefTokenAsyncKey({ userId: user.user_id });
    // lưu refresh token vào database
    await model.users.update(
      {
        refresh_token: refreshToken,
      },
      {
        where: { user_id: user.user_id },
      }
    );

    // lưu refresh token vào cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // cookie không thể truy cập được từ javascript để bảo mật
      secure: false, // dùng cho localhost, nếu chạy https thì phải set là true
      sameSite: "Lax", // đảm bảo cookie được gửi trong nhiều domain khác nhau
      maxAge: 7 * 24 * 60 * 60 * 1000, // thời gian tồn tại là 7 ngày
    });

    return res.status(200).json({
      message: "Login successfully",
      data: accessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};

const forgotPass = async (req, res) => {
  try {
    // get email from body
    let { email } = req.body;

    //  kiểm tra email có tồn tại trong database hay không
    let checkEmail = await model.users.findOne({
      where: { email },
    });

    if (!checkEmail) {
      return res.status(400).json({ message: "Email is wrong" });
    }

    //  tạo code
    let randomCode = crypto.randomBytes(5).toString("hex");

    // tạo biến lưu expired code
    let expired = new Date(new Date().getTime() + 1 * 60 * 60 * 1000);
    //  lưu code vào database
    await model.code.create({
      code: randomCode,
      expired,
    });

    //  send email
    // cấu hình info email
    const mailOption = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Mã xác thực",
      text: `Hệ thống gửi bạn mã code forgot password`,
      html: `<h1>${randomCode}</h1>`,
    };

    // gửi mail
    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        return res.status(500).json({ message: "Sending email error" });
      }
      return res.status(200).json({
        message: "Please check your email",
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "error API forgot password" });
  }
};

const changePass = async (req, res) => {
  try {
    let { code, email, newPass } = req.body;
    // kiểm tra code có tồn tại trong db hay không
    let checkCode = await model.code.findOne({
      where: { code },
    });
    if (!checkCode) {
      return res.status(400).json({ message: "Code is wrong" });
    }

    // check code có còn expired hay không

    // kiểm tra email có tồn tại trong db hay không
    let checkEmail = await model.users.findOne({ where: { email } });
    if (!checkEmail) {
      return res.status(400).json({ message: "Email is wrong" });
    }

    let hashNewPass = bcrypt.hashSync(newPass, 10);
    checkEmail.pass_word = hashNewPass;
    checkEmail.save();

    // remove code sau khi change password thành công
    await model.code.destroy({
      where: { code },
    });

    return res.status(200).json({ message: "Change password successfully" });
  } catch (error) {
    return res.status(500).json({ message: "error API change password" });
  }
};
export {
  register,
  login,
  loginFacebook,
  extendToken,
  loginAsyncKey,
  forgotPass,
  changePass,
};
