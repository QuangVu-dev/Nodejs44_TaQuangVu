import express from "express";
import { createUser } from "../controllers/user.controller.js";
import pool from "../../db.js";
import { OK, INTERNAL_SERVER } from "../../const.js";

const userRoutes = express.Router();

userRoutes.post("/:id/:hoTen", createUser);
userRoutes.get("/get-users", async (req, res) => {
   try {
      const [data] = await pool.query(`
      SELECT * FROM users
      LIMIT 1
      `);
      res.status(OK).json(data);
   } catch (error) {
      res.status(INTERNAL_SERVER).json({ message: "error" });
   }
});

export default userRoutes;
