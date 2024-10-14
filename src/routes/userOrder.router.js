import express from "express";
import { addOrder } from "../controllers/userOrder.controller.js";

const userOrderRoutes = express.Router();
userOrderRoutes.post("/add-order", addOrder);

export default userOrderRoutes;
