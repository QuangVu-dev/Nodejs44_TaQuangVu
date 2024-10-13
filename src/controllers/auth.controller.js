import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";

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
         pass_word: pass,
      });
      return res.status(200).json({
         message: `Đăng ký thành công`,
         data: userNew,
      });
   } catch (error) {
      return res.status(500).json({ message: "error" });
   }
};

export { register };
