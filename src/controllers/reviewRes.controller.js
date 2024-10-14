import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";

const model = initModels(sequelize);

const addReview = async (req, res) => {
   const { user_id, res_id, amount } = req.body;
   try {
      let data = await model.rate_res.create({ user_id, res_id, amount, date_rate: new Date() });
      return res.status(200).json(data);
   } catch (error) {
      return res.status(500).json({ message: "error" });
   }
};

const getReviewByRestaurant = async (req, res) => {
   const { restaurantId } = req.params;
   try {
      const data = await model.rate_res.findAll({
         where: { res_id: restaurantId },
      });
      return res.status(200).json(data);
   } catch (error) {
      return res.status(500).json({ message: "error" });
   }
};

const getReviewByUser = async (req, res) => {
   const { userId } = req.params;
   try {
      const data = await model.rate_res.findAll({
         where: { res_id: userId },
      });
      return res.status(200).json(data);
   } catch (error) {
      return res.status(500).json({ message: "error" });
   }
};

export { addReview, getReviewByRestaurant, getReviewByUser };
