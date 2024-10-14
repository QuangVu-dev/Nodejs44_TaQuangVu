import express from "express";
import {
   addReview,
   getReviewByRestaurant,
   getReviewByUser,
} from "../controllers/reviewRes.controller.js";

const reviewResRoutes = express.Router();
reviewResRoutes.post("/add-review", addReview);
reviewResRoutes.get("/get-review-by-restaurant/:restaurantId", getReviewByRestaurant);
reviewResRoutes.get("/get-review-by-user/:userId", getReviewByUser);

export default reviewResRoutes;
