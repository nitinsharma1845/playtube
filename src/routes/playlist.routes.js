import { Router } from "express";
import {
  addToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylist,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-playlist").post(verifyJWT, createPlaylist);
router
  .route("/:playlistId")
  .get(getPlaylistById)
  .delete(verifyJWT, deletePlaylist)
  .patch(verifyJWT, updatePlaylist);
router
  .route("/:playlistId/:videoId")
  .post(verifyJWT, addToPlaylist)
  .delete(verifyJWT, removeVideoFromPlaylist);

router.route("/my-playlist/:userId").get(verifyJWT, getUserPlaylist);

export default router;
