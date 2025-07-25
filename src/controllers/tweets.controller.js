import { asyncHandler } from "../utils/asyncHandler";
import { apiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { Tweet } from "../models/tweets.model";

const createTweet = asyncHandler(async (req, res) => {
  try {
    if (!req.user) throw new apiError(400, "Please Login User not found");
    const { content } = req.body;

    if (!content) throw new apiError(400, "Content is required!");

    const tweet = await Tweet.create({
      owner: req.user?._id,
      content: content.trim(),
    });

    res
      .status(201)
      .json(new ApiResponse(201, tweet, "Tweet Created Successfully !"));
  } catch (error) {
    console.log("Error while Creating Tweet:::::::", error.message);
  }
});

const getAllTweet = asyncHandler(async (req, res) => {
  const tweets = await Tweet.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
    {
      $project: {
        "owner.password": 0,
        "owner.refreshToken": 0,
        "owner.watchHistory": 0,
        "owner.coverImage": 0,
        "owner.createdAt": 0,
        "owner.updatedAt": 0,
      },
    },
  ]);

  if (!tweets) throw new apiError(401, "No tweets Found");

  res
    .status(200)
    .json(new ApiResponse(200, tweets, "All Tweets fetched successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const tweets = await Tweet.aggregate([
    {
      $match: {
        owner: userId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
    {
      $project: {
        "owner.password": 0,
        "owner.refreshToken": 0,
        "owner.watchHistory": 0,
        "owner.coverImage": 0,
        "owner.createdAt": 0,
        "owner.updatedAt": 0,
      },
    },
  ]);

  if (!tweets || tweets.length === 0) {
    throw new apiError(404, "No tweets found for this user");
  }

  res
    .status(200)
    .json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const tweetId = req.params.tweetId;
  const userId = req.body._id;

  const tweet = await Tweet.findById(tweetId);

  if (!tweetId || !userId)
    throw new apiError(400, "User or tweet may not found");

  if (userId.toLowerCase() !== tweet.owner?.toLowerCase())
    throw new apiError(400, "User is not authorized to delete the tweet!!");

  await Tweet.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Tweet Deleted Successfully"));
});

export { createTweet, getAllTweet, getUserTweets, deleteTweet };
