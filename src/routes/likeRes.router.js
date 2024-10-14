import express from "express";
import {
   toggleLike,
   getLikeByRestaurant,
   getLikeByUser,
} from "../controllers/likeRes.controller.js";

const likeResRoutes = express.Router();
likeResRoutes.post("/like-restaurant", toggleLike);
likeResRoutes.get("/get-like-by-restaurant/:restaurantId", getLikeByRestaurant);
likeResRoutes.get("/get-like-by-user/:userId", getLikeByUser);

export default likeResRoutes;
