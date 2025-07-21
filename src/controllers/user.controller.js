import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generatedJwtTokkens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "Something went Wrong while generating refresh and access tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //send post request and get data from frontend
  //validate data - not empty
  //check if user akredy registered : username and email
  //check files [avatar : required , coverImage : not required]
  //upload files to cloudinary
  //create a user object - create entry in db
  //remove password and refresh token feild from response
  //check fro user creation
  //return response
  //else send error

  const { fullName, email, username, password } = req.body;
  console.log("Email and passsword ::::::", email, password);

  console.log(req.body);
  console.log(req.files);

  if (
    [fullName, email, username, password].some((feild) => feild?.trim() === "")
  ) {
    throw new apiError(400, "All Feilds are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "User Already Register");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImagePath = req.files?.coverImage[0]?.path;

  // console.log(avatarLocalPath)
  // console.log(coverImagePath)

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar is required");
  }

  const avatar = await uploadToCloudinary(avatarLocalPath);
  const coverImage = await uploadToCloudinary(coverImagePath);

  // console.log("Avtar URL :::::::::::::" , avatar.url)

  if (!avatar) {
    throw new apiError(400, "Avatar is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Something went Wrong while registring the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Succesfully"));
});

//Login the User

//todo
//take data from form using post request
//validate the data from dtabase {specificaly email}
//if user exist then login generate access and refresh token
//send secure cokkies to use and send login success
//else send a error message

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username || !email) {
    throw new apiError(400, "Username or email is required");
  }

  const existUser = await User.findOne({
    $or: [{ username, email }],
  });

  if (!existUser) {
    throw new apiError(404, "User Does Not Exist");
  }

  const isValidUser = await existUser.isPasswordCorrect(password);
  if (!isValidUser) {
    throw new apiError(401, "Invalid User Credentials !");
  }

  const { accessToken, refreshToken } = await generatedJwtTokkens(
    existUser._id
  );

  const loggedInUser = await User.findById(existUser._id).select(
    "-password , -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User Logged In SuccessFully"
      )
    );
});

const LogOutUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await User.findByIdAndUpdate(
    userId,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User LoggedOut"));
});

export { registerUser, loginUser, LogOutUser };
