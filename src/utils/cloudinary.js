import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { apiError } from "./ApiError.js";

async function uploadToCloudinary(localFilePath) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    if (!localFilePath) throw new apiError(400, "No Loacal Path Provided");

    //upload to cloudinary

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    if (response) {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        // console.log("File deleted????????")
      }
    }
    return response;
  } catch (error) {
    // console.log("Cloudnary Error :::::::::", error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    } 
    throw new apiError(500, "Upload to Cloudinary failed");
  }
}

export { uploadToCloudinary };
