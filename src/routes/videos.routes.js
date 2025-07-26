import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  deletevideo,
  getAllVideos,
  getVideo,
  publishVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/videos.controller.js";

const router = Router();

router.route("/post-video").post(
  verifyJWT,
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishVideo
);

router.route("/:videoId").get(getVideo);

router.route("/update-details/:videoId").patch(verifyJWT, updateVideo);

router.route("/delete-video/:videoId").delete(verifyJWT, deletevideo);

router.route("/video-status/:videoId").patch(verifyJWT, togglePublishStatus);

router.route("/").get(getAllVideos);

export default router;
