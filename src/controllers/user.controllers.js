import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiErrors.js";
import {User} from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/apiResponse.js"
import {jwt} from "jsonwebtoken";


const generateAcessandRefreshTokens = async(userId)=> {
    try { //step 6 of login user 
        const user = await User.findById(userId)
        const accessToken =  user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken //model for db for refresh token
        await user.Save({ validateBeforeSave : false })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong generating refresh tokens")
        
    }
}


const registerUser = asyncHandler (async(req,res)=>{
        // STEPWISE ALGORITHM TO WRITE THE FIRST BACKEND CODE 
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

const loginUser = asyncHandler(async(req,res)=>{
    // algorithm for the tokens 
    // 1. req body -> data 
    // 2. username or email 
    // 3. find the user 
    // 4. if the user is not found out, make him sign up 
    // 5. password check 
    // 6. generate the access and refresh token 
    // 7.send cookie 

    const {email, username , password } = req.body //step 1 (req body -> data)

    if(!username || !email) { 
        throw new ApiError(400, "username or password is required")
    }  //step 2 init (username and email)

    const user = await User.findOne({
        $or: [{username},{email}] //mongodb operators, not used for the normal operational practice 
    }) // step 2 final (username and email)

    if(!user){
        throw new ApiError (404, "User does'nt exist") 
    } // step 3 (find the user)

    // step 4 as such not needed

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError (401, "Invalid user credentials") 
    } // step 5 is done (pass check)

    const {accessToken, refreshToken} = await generateAcessandRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure : true,
    }
    
    
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,accessToken,refreshToken
            },
            "User logged in successfully"
        )
    )

})


const logoutUser = asyncHandler(async(req,res)=> {
    User.findByIdAndDelete(
        req.user._id, {
            $set: {
                refreshToken: undefined
            },
        },
        {
            new: true,
        }
    )

    const options = {
        httpOnly : true,
        secure : true,
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refrshToken",options)
    .json(new ApiResponse(200,{}, "User Logged out"))
})

const refreshAccessToken = asyncHandler(async (req,res)=>{
    const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken 
    
    if (!incomingrefreshToken){
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingrefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401,"Invalid Refresh Token")
        }
    
        if(incomingrefreshToken!== user?.refreshToken){
            throw new ApiError(401,"Refresh Token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure : true
        }
    
        const {accessToken, refreshToken } = await generateAcessandRefreshTokens(user._id)
        
        
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken , refreshToken : newRefreshToken}
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || " Invalid refresh Token" )
        
    }
})
export { registerUser, loginUser, logoutUser, refreshAccessToken}