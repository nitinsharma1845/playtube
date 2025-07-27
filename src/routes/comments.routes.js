import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addComent,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comments.controller.js";

const router = Router();

router.route("/video-comments/:videoId").get(getVideoComments);
router.route("/add-comment/:videoId").post(verifyJWT, addComent);
router.route("/update-comment/:commentId").patch(verifyJWT, updateComment);
router.route("/delete-comment/:commentId").delete(verifyJWT, deleteComment);

export default router;
