import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";

const model = initModels(sequelize);

const toggleLike = async (req, res) => {
   const { user_id, res_id } = req.body;
   try {
      let like = await model.like_res.findOne({ where: { user_id, res_id } });
      if (like) {
         await like.destroy();
         return res.status(200).json({ message: "Unliked restaurant" });
      } else {
         await model.like_res.create({ user_id, res_id, date_like: new Date() });
         return res.status(200).json({ message: "Liked restaurant" });
      }
   } catch (error) {
      console.error("Error liking the restaurant:", error.message);
      return res.status(500).json({ message: "error" });
   }
};

const getLikeByRestaurant = async (req, res) => {
   const { restaurantId } = req.params;
   try {
      const data = await model.like_res.findAll({
         where: { res_id: restaurantId },
      });
      return res.status(200).json(data);
   } catch (error) {
      return res.status(500).json({ message: "error" });
   }
};

const getLikeByUser = async (req, res) => {
   const { userId } = req.params;
   try {
      const data = await model.like_res.findAll({
         where: { user_id: userId },
      });
      return res.status(200).json(data);
   } catch (error) {
      return res.status(500).json({ message: "error" });
   }
};

export { toggleLike, getLikeByRestaurant, getLikeByUser };
