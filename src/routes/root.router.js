import express from "express";
import userRoutes from "./user.router";

// tạo object router tổng
const rootRoutes = express.Router();

rootRoutes.use("/users", userRoutes);

// export rootRoutes cho index.js
export default rootRoutes;
