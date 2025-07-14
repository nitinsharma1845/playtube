import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(localFilePath) {
  try {
    if (!localFilePath) return null;
    
    //upload to cloudinary

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File uploaded!!", "RESPONSE ::::::", response.url);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the localaly save temp file as the upload operation got failed
    return null;
  }
}


export {uploadToCloudinary}
