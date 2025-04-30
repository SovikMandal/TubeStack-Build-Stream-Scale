import { upload } from "../middlewares/multer.middlewares.js";
import { User } from "../models/user.modles.js";
import uploadOnCloudinary from "../service/cloudinary.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler( async (req, res) => {

// get user details from frontend

    const {fullName, username, email, password} = req.body;
    console.log("email", email);

// validation - not empty

    /*
    if(fullName === "") {
        throw new apiError(400, "fullname is required")  --> you can check also one by one.
    } 
    */

    if (
        [fullName, email, username, password].some((filed) => {
            return filed ?.trim() === ""
        })
    ) {
        throw new apiError(400, "All fields are required");
    }

// check if user already exit - check username or email

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser) {
        throw new apiError(409, "User wthi email or username already exist")
    }

// check for images, check for avatar

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLoaclPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) {
        throw new apiError(400, "Avatar file is required")
    }

// upload them cloudinary, avatar check

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLoaclPath);

    if(!avatar) {
        throw new apiError(400, "Avatar file is required")
    }

// create user object - create entry in db

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowercases()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    ) 
// remove password and referesh token filed from response
// check user creation

    if(!createdUser) {
        throw new apiError(500, "Somthing went wrong while registering the user.");
    }

// response return

    return res.status(201).json(
        new apiResponse(200, createdUser, "User regiser successfully.")
    )
    
})

export default registerUser;