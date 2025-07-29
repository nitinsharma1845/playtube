import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Likes } from "../models/likes.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  if (!videoId) throw new apiError(404, "No videoId found");

  const likeExists = await Likes.findOne({ video: videoId, likedBy: userId });

  if (likeExists) {
    await likeExists.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Unliked The video"));
  } else {
    const like = await Likes.create({
      video: videoId,
      likedBy: userId,
    });

    return res.status(200).json(new ApiResponse(200, like, "Liked the video"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user?._id;

  if (!tweetId) throw new apiError(404, "Tweet id is missing");

  const isLiked = await Likes.findOne({ tweet: tweetId, likedBy: userId });

  if (isLiked) {
    await isLiked.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Unliked the tweet"));
  } else {
    const like = await Likes.create({ tweet: tweetId, likedBy: userId });
    return res.status(200).json(new ApiResponse(200, like, "Liked the tweet"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user?._id;

  if (!commentId) throw new apiError(404, "comment id is missing");

  const isLiked = await Likes.findOne({ comment: commentId, likedBy: userId });

  if (isLiked) {
    await isLiked.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Unliked the comment"));
  } else {
    const like = await Likes.create({ comment: commentId, likedBy: userId });
    return res
      .status(200)
      .json(new ApiResponse(200, like, "Liked the comment"));
  }
});

const getVideoLiked = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) throw new apiError(404, "user id is missing");

  const likedVideos = await Likes.find({
    likedBy: userId,
    video: { $exists: true },
  }).populate("video", "owner thumbnail duration title");

  if (!likedVideos || likedVideos.length === 0)
    throw new apiError(400, "No liked Video");

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked Videos Fetched successfully")
    );
});

export { toggleVideoLike, toggleTweetLike, toggleCommentLike, getVideoLiked };
