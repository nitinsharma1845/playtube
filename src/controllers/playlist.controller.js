import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/ApiError.js";
import { PlayList } from "../models/playlist.model.js";
import mongoose from "mongoose";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user?._id;

  if (!name || !description)
    throw new apiError(404, "name or description is missing !!");

  const playlist = await PlayList.create({
    name,
    description,
    owner: userId,
  });

  if (!playlist) throw new apiError(500, "Error while created the playlist");

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist Created successfull"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) throw new apiError(404, "Playlist id not found");

  const playList = await PlayList.findById(playlistId);

  if (!playList) throw new apiError(404, "Playlist not found");

  return res
    .status(200)
    .json(new ApiResponse(200, playList, "Playlist fetch successfully"));
});

const addToPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;
  const userId = req.user?._id;

  if (
    !mongoose.Types.ObjectId.isValid(videoId) ||
    !mongoose.Types.ObjectId.isValid(playlistId)
  )
    throw new apiError(404, "video or playlist id is not valid");

  const playlist = await PlayList.findById(playlistId);

  console.log(playlist);

  if (!playlist) throw new apiError(404, "No such playlist");

  if (playlist.owner.toString() !== userId.toString())
    throw new apiError(403, "user is not authorized for perform action");

  if (playlist.video.includes(videoId))
    throw new apiError(400, "Video is already in playlist");

  playlist.video.push(videoId);
  await playlist.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video added successfully!"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;
  const userId = req.user?._id;

  if (
    !mongoose.Types.ObjectId.isValid(videoId) ||
    !mongoose.Types.ObjectId.isValid(playlistId)
  )
    throw new apiError(404, "video or playlist id is not valid");

  const playlist = await PlayList.findById(playlistId);

  if (!playlist) throw new apiError(404, "No such playlist");

  if (playlist.owner.toString() !== userId.toString())
    throw new apiError(403, "user is not authorized for perform action");

  playlist.video = playlist.video.filter(
    (id) => id.toString() !== videoId.toString()
  );

  await playlist.save({ validateBeforeSave: false });

  //   console.log(playlist.video);

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video is removed from playlist"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const userId = req.user?._id;

  if (
    !mongoose.Types.ObjectId.isValid(playlistId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  )
    throw new apiError(400, "Play list or user id is not valid");

  const playlist = await PlayList.findById(playlistId);

  if (!playlist) throw new apiError(404, "Playlist not found");

  if (!playlist.owner.equals(userId))
    throw new apiError(403, "User is not authorised to perform that action");

  await PlayList.deleteOne({ _id: playlistId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  const userId = req.user?._id

  if (!mongoose.Types.ObjectId.isValid(playlistId))
    throw new apiError(404, "playlist id is not valid");

  if (!name.trim() || !description.trim())
    throw new apiError(404, "name or decription is missing");

  const playlist = await PlayList.findById(playlistId);
  if (!playlist) throw new apiError(404, "No such playlist found");


  if (playlist.owner.toString() !== userId.toString())
    throw new apiError(
      403,
      "User is not authorized for performing that action"
    );

  playlist.name = name;
  playlist.description = description;
  await playlist.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully!!"));
});

const getUserPlaylist = asyncHandler(async (req, res) => {
  const {userId} = req.params;

  const playlist = await PlayList.find({ owner: userId });

  if (!playlist || playlist.length === 0) throw new apiError(404, "No playlist Found");

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist fetched successfully"));
});

export {
  createPlaylist,
  getPlaylistById,
  addToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
  getUserPlaylist
};
