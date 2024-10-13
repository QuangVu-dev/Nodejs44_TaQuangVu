import express from "express";
import { register } from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);

export default authRoutes;
