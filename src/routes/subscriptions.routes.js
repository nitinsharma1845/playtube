import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getSubscribedTo,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscriptions.controller.js";

const router = Router();

router.route("/toggle/:channelId").post(verifyJWT, toggleSubscription);
router.route("/:userId/subscribers").get(verifyJWT, getUserChannelSubscribers);
router.route("/:subscribedTo/subscribed").get(verifyJWT, getSubscribedTo);

export default router;
