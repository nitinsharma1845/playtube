import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { channelId } = req.params;

  if (userId.toString() === channelId.toString())
    throw new apiError(400, "You can not subscribe your self");

  const existingSubscription = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });

  if (existingSubscription) {
    await existingSubscription.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Unsubscribed Successfully!"));
  } else {
    const subscriber = await Subscription.create({
      subscriber: userId,
      channel: channelId,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, subscriber, "Subscribed successfully"));
  }
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const subscriber = await Subscription.find({ channel: userId }).populate(
    "subscriber",
    "fullName avatar username"
  );

  if (!subscriber || subscriber.length === 0)
    throw new apiError(404, "No subscribers found");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscriberCount: subscriber.length, subscriber },
        "Subscriber fetched successully "
      )
    );
});

const getSubscribedTo = asyncHandler(async (req, res) => {
  const { subscribedTo } = req.params;

  const subscribed = await Subscription.find({
    subscriber: subscribedTo,
  }).populate("channel", "fullName , username , avatar");

  if (!subscribed || subscribed.length === 0)
    throw new apiError(404, "No channel subscribed");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscribedToCount: subscribed.length, subscribed },
        "Subscribed Channel fetched successfully"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedTo };
