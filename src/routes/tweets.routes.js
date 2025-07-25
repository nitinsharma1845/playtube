import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  deleteTweet,
  getAllTweet,
  getUserTweets,
} from "../controllers/tweets.controller.js";

const router = Router();

router.route("/my-tweets").get(verifyJWT, getUserTweets);
router.route("/all-tweets").get(getAllTweet);
router.route("/post-tweet").post(verifyJWT, createTweet);
router.route("/delete-tweet/:tweetId").delete(verifyJWT, deleteTweet);

export default router;
