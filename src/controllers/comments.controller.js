import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";

const addComent = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;
  const userId = req.user?._id;

  if (!content) throw new apiError(404, "Comment content is missing");
  if (!videoId) throw new apiError(404, "Video Id is missing");
  if (!userId) throw new apiError(404, "User Id is missing");

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: userId,
  });

  if (!comment) throw new apiError(400, "Error while adding comment");

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user?._id;
  const {content} = req.body;

  if (!commentId) throw new apiError(404, "CommentId not found");
  if (!userId) throw new apiError(404, "userId not found");

  const comment = await Comment.findById({_id : commentId});

  if (!comment) throw new apiError(404, "No such comment found");
  console.log(comment)

  if (!comment.owner.equals(userId))
    throw new apiError(403, "User is not authorisesd to perform action");

  comment.content = content;
  await comment.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully!"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user?._id;

  if (!commentId) throw new apiError(404, "CommentId not found");
  if (!userId) throw new apiError(404, "userId not found");

  const comment = await Comment.findById(commentId);

  if (!comment) throw new apiError(404, "No comment found");

  if (!comment.owner.equals(userId))
    throw new apiError(403, "User is not authorised to perform that action");

  await Comment.deleteOne(new mongoose.Types.ObjectId(commentId));

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully!"));
});

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  if (!videoId) throw new apiError(404, "Video Id not found");

  const comment = await Comment.find({ video: videoId })
    .populate("owner", "username fullname avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  if (!comment) throw new apiError(404, "No comment found");

  const commentCount = await Comment.countDocuments({ video: videoId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { comment, commentCount, limit, page },
        "All comment fetched successfully "
      )
    );
});

export { addComent, deleteComment, updateComment, getVideoComments };
