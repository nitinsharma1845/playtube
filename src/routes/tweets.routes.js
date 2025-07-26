import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  deleteTweet,
  getAllTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweets.controller.js";

const router = Router();

router.route("/my-tweets").get(verifyJWT, getUserTweets);
router.route("/all-tweets").get(getAllTweet);
router.route("/post-tweet").post(verifyJWT, createTweet);
router.route("/delete-tweet/:tweetId").delete(verifyJWT, deleteTweet);
router.route("/update-tweet/:tweetId").delete(verifyJWT, updateTweet);

export default router;
