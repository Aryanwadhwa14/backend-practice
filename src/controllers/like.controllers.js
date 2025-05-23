import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apiErrors.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


/////////////// toggle like on video ///////////////
// 1. get videoId from params URL
// 2. check if the user has already liked the video
// 3. if already liked then delete the like
// 4. if not liked then add the like
const toggleVideoLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on video
    // 1. get videoId from params Url 
    const  {videoId} = req.params

    if(!isValidObjectId(videoId)) { throw new ApiError(400, "Invalid Video")}

    //2. check if the user has already liked the video
    const VideoLike = await Like.findOne({
        $and : [{ likedBy: req.user?._id}, {video: videoId}]
    })

    // 3. if already liked then delete the like
    if ( VideoLike )
    {
        const unLike = await Like.findByIdAndDelete( VideoLike._id )

        return res.status( 200 )
            .json( new ApiResponse( 200, unLike, "Like removed" ) )
    }

     // 4. if not liked then add the like
     const Liked = await Like.create( {
        likedBy: req.user?._id,
        video: videoId
    } )

    return res.status( 200 )
        .json( new ApiResponse( 200, Liked, "Like added" ) )

})



// /////////////// toggle like on comment ///////////////
//TODO: toggle like on comment
// 1. get commentId from params URL
// 2. check if the user has already liked the comment
// 3. if already liked then delete the like
// 4. if not liked then add the like
const toggleCommentLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on comment
    // 1. get commentId from params URL
    const { commentId } = req.params

    if ( !isValidObjectId( commentId ) ) { throw new Apierror( 400, "Invalid comment" ) }

    // 2. check if the user has already liked the comment
    const commentLike = await Like.findOne( {
        $and: [ { likedBy: req.user?._id }, { comment: commentId } ]
    } )

    // 3. if already liked then delete the like
    if ( commentLike )
    {
        const unLike = await Like.findByIdAndDelete( commentLike._id )

        return res.status( 200 )
            .json( new ApiResponse( 200, unLike, "Like removed" ) )
    }

    // 4. if not liked then add the like
    const Liked = await Like.create( {
        likedBy: req.user?._id,
        comment: commentId
    } )

    return res.status( 200 )
    .json(new ApiResponse(200, Liked, "Liked added"))
})


/////////////// toggle like on tweet ///////////////
//TODO: toggle like on tweet
// 1. get tweetId from params URL
// 2. check if the user has already liked the tweet
// 3. if already liked then delete the like
// 4. if not liked then add the like
const toggleTweetLike = asyncHandler(async (req, res) => {
    //TODO: toggle like on tweet
    // 1. get tweetId from params URL
    const { tweetId } = req.params

    if ( !isValidObjectId( tweetId ) ) { throw new Apierror( 400, "Invalid tweet" ) }

    // 2. check if the user has already liked the tweet
    const tweetLike = await Like.findOne( {
        $and: [ { likedBy: req.user?._id }, { tweet: tweetId } ]
    } )

    // 3. if already liked then delete the like
    if ( tweetLike )
    {
        const unLike = await Like.findByIdAndDelete( tweetLike._id )

        return res.status( 200 )
            .json( new ApiResponse( 200, unLike, "Like removed" ) )
    }

    // 4. if not liked then add the like
    const Liked = await Like.create( {
        likedBy: req.user?._id,
        tweet: tweetId
    } )
}
)


/////////////// get liked videos ///////////////
// 1. find all the liked videos of the logged in user
// 2. return the list of liked videos
const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    //1. find all the liked videos of the logged in user 
    const LikedVideos = await Like.find({
        $and : [{ likedBy: req.user?._id}, {video : { $exists: true}}]
    })

    if ( !LikedVideos ) { throw new Apierror( 500, "Liked Videos Not Found!" ) }

    // 2. return the list of liked videos
    return res.status( 200 )
        .json( new ApiResponse( 200, { "Total_Videos": LikedVideos.length, "Videos": LikedVideos }, "Videos found!" ) )
})


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}