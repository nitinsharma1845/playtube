import { Router } from "express";

import {
  changeCurrentPassword,
  currentUser,
  getUserWatchHistory,
  loginUser,
  LogOutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  userChannelProfile,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// /securesRoutes
router.route("/logout").post(verifyJWT, LogOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, currentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateAvatar);

router
  .route("/update-coverImage")
  .patch(verifyJWT, upload.single("coverImage"), updateCoverImage);

router.route("/channel/:username").get(verifyJWT, userChannelProfile);

router.route("/history").post(verifyJWT, getUserWatchHistory);

export default router;
