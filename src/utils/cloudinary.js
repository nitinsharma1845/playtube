import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { apiError } from "./ApiError.js";
import { ApiResponse } from "./ApiResponse.js";

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
    console.log(response)
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


async function deleteImage(publicId){
  try {
    return await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.log("Error while deleting the file :::::::" , error)
  }

}

export { uploadToCloudinary, deleteImage };
