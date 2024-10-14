import express from "express";
import likeResRoutes from "./likeRes.router.js";
import reviewResRoutes from "./reviewRes.router.js";
import userOrderRoutes from "./userOrder.router.js";

// tạo object router tổng
const rootRoutes = express.Router();

rootRoutes.use("/like", likeResRoutes);
rootRoutes.use("/review", reviewResRoutes);
rootRoutes.use("/order", userOrderRoutes);

// export rootRoutes cho index.js
export default rootRoutes;
