import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";

const model = initModels(sequelize);

const addOrder = async (req, res) => {
   const { user_id, food_id, amount, discount_code, arr_sub_id } = req.body;
   try {
      let data = await model.orders.create({ user_id, food_id, amount, discount_code, arr_sub_id });
      return res.status(200).json(data);
   } catch (error) {
      console.error("Error adding order:", error);
      return res.status(500).json({ message: "error" });
   }
};
export { addOrder };
