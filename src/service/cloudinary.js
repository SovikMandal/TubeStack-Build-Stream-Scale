import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDEINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDEINARY_API_KEY, 
    api_secret: process.env.CLOUDEINARY_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        }) 
        // file has been uploaded
        // console.log("file has uploded on cloudeinary.")
        // console.log(response.url)
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload got failed.
        return null;
    }
}

export default uploadOnCloudinary;