import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiErrors.js";
import {User} from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/apiResponse.js"

const registerUser = asyncHandler (async(req,res)=>{
        // STEPWISE ALGORITHM TO WRITE THE FIRST BACKENC CODE 
        // 1. get user details form frontend (db connected nhai he toh postman me nhi dikhega hume )
        // 2. validation -- not empty 
        // 3. check if user already exists : username , email 
        // 4. check for images , check for avatar 
        // 5. upload them to cloudinary 
        // 6. create the user object - create entry in db
        // 7. remove password and refresh token field from response 
        // 8. check for user creation 
        // 9. return res 


    const {fullname, email, username, password } = req.body
    console.log("email",email) // 1st step is done 
    
    if ( //2nd and 3rd step 
        [fullname , email , username , password].some((field)=> 
        field?.trim()=== "")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = await User.findOne({
        $or : [{username},{email},{}]
    })

    if (existedUser){
        throw new ApiError(409, "Usr with email or username already exists")
    }

    const avatarLocalpath = req.files?.avatar[0]?.path;
    const coverImageLocalpath = req.files?.coverImage[0]?.path;
    
    let coverImageLocalPath ; //scope 
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
       // coverImageLocalPath = req.files.coverImage[0]?.path;
    }
    
    
    if(!avatarLocalpath){ // step 4 is done 
        throw new ApiError(400,"Avatar file is required ")
    }


    const avatar = await uploadOnCloudinary(avatarLocalpath)
    const coverImage = await uploadOnCloudinary(coverImageLocalpath)

    if(!avatar) { // step 5 is done 
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({ //step 6 is donee 
        fullname,
        avatar : avatar.url,
        coverImage: coverImage.url || "",
        email, 
        password,
        username: username.toLowerCase()

    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" // step 7 is done
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    } // step 8 is done (user creation is step)

    return res.status(200).json(
        new ApiResponse(200, createdUser , "user registered successfully")
    )

    // all the steps are done !!! ,


})

//next step is to made routes 


export { registerUser }