import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/ApiError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description)
    throw new apiError(401, "Title or Description is required");

  const videoLocalPath = req.files?.video[0]?.path;
  const tumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoLocalPath) throw new apiError(404, "Video not found !");

  const videoFile = await uploadToCloudinary(videoLocalPath);

  const thumbnail = await uploadToCloudinary(tumbnailLocalPath);

  if (!videoFile)
    throw new apiError(500, "error while uploading to cloudinary");

  const video = await Video.create({
    title,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    description,
    duration: videoFile.duration,
    owner: req.user._id,
  });

  if (!video) throw new apiError(500, "Failed to post the video");

  const postedVideo = await Video.findById(video._id);

  return res
    .status(200)
    .json(new ApiResponse(200, postedVideo, "Video posted Successfully"));
});

const getVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) throw new apiError(404, "Vedio not Found");

  const video = await Video.findById(videoId);

  if (!video) throw new apiError(404, "Video not found ");

  video.views += 1;
  await video.save({ validateBeforeSave: false });

  await video.populate("owner", "-password -refreshToken -watchHistory -email");

  return res
    .status(200)
    .json(new ApiResponse(200, video, "video fetched successfully "));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;
  const { title, description } = req.body;

  if (!videoId) throw new apiError(404, "No Video Id Found");
  if (!userId) throw new apiError(404, "No User Id Found");
  if (!title) throw new apiError(400, "title is required");
  if (!description) throw new apiError(400, "description is required");

  const video = await Video.findById(videoId);

  if (video.owner.toString() !== userId.toString())
    throw new apiError(401, "User is nott authorized to update details");

  video.title = title;
  video.description = description;
  await video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"));
});

const deletevideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  const video = await Video.findById(videoId);

  if (!video) throw new apiError(404, "Video not Found");

  if (!video.owner.equals(userId))
    throw new apiError(400, "You are not authorized to delete the video");

  await Video.deleteOne({ _id: videoId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) throw new apiError(404, "Video Id not found");

  const video = await Video.findById(videoId);

  if (!video) throw new apiError(404, "Video not found");

  if (!video.owner.equals(req.user?._id))
    throw new apiError(403, "User is not authorized to perform that action");

  video.isPublished = !video.isPublished;
  await video.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        video,
        `your video is ${video.isPublished ? "published" : "unpublished"} successfully !`
      )
    );
});

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, querry } = req.query;

  const skip = (page - 1) * limit;

  const filter = querry ? { title: { $regex: querry, $options: "i" } } : {};

  const videosCount = await Video.countDocuments();

  const video = await Video.find(filter)
    .populate("owner", "username fullName avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        video,
        totalVideos: videosCount,
        currentPage: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(videosCount / limit),
      },
      "Videos fetched successfully"
    )
  );
});

export {
  publishVideo,
  getVideo,
  updateVideo,
  deletevideo,
  togglePublishStatus,
  getAllVideos,
};
