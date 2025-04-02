import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

////////////////////////// create playlist //////////////////////////
//TODO: create playlist
// 1. get name and description from req.body
// 2. create document in db and dont add any video
const createPlaylist = asyncHandler(async (req, res) => {
    //TODO: create playlist
    const {name, description} = req.body
    // 1. get name and description from req.body 
    if(!name && !description) {throw new ApiError(400 , "Please provide the correct username and description")}

    //2. create a document in db and dont add any video 
    const createPlaylist = Playlist.create({
        name : name,
        description : description,
        owner : new mongoose.Types.ObjectId( req.user._id)
    })

    if(!createPlaylist){throw new ApiError(400, " Playlist not created, please try again")}

    return res.status(200)
    .json(new ApiResponse(200, createPlaylist, "playlist created!"))
})

//////////////////////// get user playlists //////////////////////////
// 1. get userId from params URL
// 2. find all the playlists of the user
//TODO: get user playlists
const getUserPlaylists = asyncHandler(async (req, res) => {
    //TODO: get user playlists
    // 1. get useId from params Url
    const {userId} = req.params
    if(!isValidObjectId(userId)) {throw new ApiError(400, " Inavlid Userid!")}

    //2. find all the playlist of the user 
    const getPlaylist = await Playlist.find({
        owner : userId
    }) 

    if(!getPlaylist) {throw new ApiError(400, getPlaylist, " Playlist can't be found")}

    return res.status(200)
    .json(new ApiResponse(200, getPlaylist, "Playlist FOUND"))
})

//////////////////////// get playlist by id //////////////////////////
// 1. get playlistId from params URL
// 2. find the playlist by id
//TODO: get playlist by id
const getPlaylistById = asyncHandler(async (req, res) => {
    //TODO: get playlist by id
    // 1. get playlistId from params URL
    const {playlistId} = req.params
    if(!isValidObjectId(playlistId)){throw new ApiError(400,"Playlist Id is wrong!")}

    // 2. find the playlist by id
    const findPlaylist = await Playlist.findById(playlistId)

    if(!findPlaylist){throw new ApiError(400, findPlaylist, "playlist not found ")}

    return res.status(200)
    .json(new ApiResponse(200, playlistId, "playlist found"))
})


//////////////////////// add video to playlist //////////////////////////
// 1. get playlistId and videoId from params URL
// 2. find the playlist by playlistId in db
// 3. check if the playlist owner is the same as the logged-in user
// 4. check if the video already exists in the playlist
// 5. push the video to the playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    // 1. get playlistId and videoId from params URL
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(playlistId) && !isValidObjectId(videoId)) {throw new ApiError(400, "Invalid playlistId or videoId" )}

    // 2. find the playlist by playlistId in db
    const findPlaylist = await Playlist.findById(playlistId)

    if ( !findPlaylist ) { throw new Apierror( 400, "Playlist not found!" ) }

    // 3. check if the playlist owner is the same as the logged-in user
    if(!findPlaylist.owner.equals(req.user?._id)) {throw new ApiError(400, "You can't update playlist!")}

    //4. check if the video already exist in the playlist 
    if(findPlaylist.video.includes(videoId)) {throw new ApiError(400, "Video already exists in playlist You cant add this video in the playlist!")}

    // 5. push the video to the playlist
    findPlaylist.video.push(videoId) // push method is used 
    const videoAdded = await findPlaylist.save()

    if(! videoAdded) { throw new ApiError(500, " video is not added in the playlist, please try again!")}

    return res.status(200)
    .json(new ApiResponse(200, videoAdded, "Video added in the playlist!"))
})


//////////////////////// remove video from playlist //////////////////////////
// TODO: remove video from playlist
// 1. get playlistId and videoId from params URL
// 2. find the playlist by playlistId in db based on playlistId and videoId
// 3. check if the playlist owner is the same as the logged-in user
// 4. remove the video from the playlist and save it to the database
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    // TODO: remove video from playlist
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(playlistId) && !isValidObjectId(videoId)) {throw new ApiError(400,"Invalid playlist and video id")}

    // 2. find the playlist by playlistId in db based on playlistId and videoId
    const findVideo = await Playlist.findOne({
        $and : [
            { _id: playlistId},
            { video : videoId }
        ]
    })

    if ( !findVideo ) { throw new ApiError( 400, "Playlist not found!" ) }

    // 3. check if the playlist owner is the same as the logged-in user
    if ( !findVideo.owner.equals( req.user?._id ) ) { throw new Apierror( 400, "You can't update this playlist!" ); }

    // 4. remove the video from the playlist and save it to the database

    findVideo.video.pull(videoId) 
    const videoRemoved = await findVideo.save()

    if(!videoRemoved){throw new ApiError(400, "Please try again! ")}

    return res.status( 200 )
    .json( new ApiResponse( 200, videoRemoved, "Video Removed Successsfully" ) )
})


//////////////////////// delete playlist //////////////////////////
// 1. get playlistId from params URL
// 2. find the playlist by id
// 3. check if the playlist owner is the same as the logged-in user
// 4. delete the playlist
const deletePlaylist = asyncHandler(async (req, res) => {
    // TODO: delete playlist
    // 1. get playlistId from params URL
    const {playlistId} = req.params
    if(!isValidObjectId(playlistId)){throw new ApiError(400, "Invalid Playlist Id")}

    // 2. find the playlist by id
    const findPlaylist = await Playlist.findById( playlistId )

    if(!findPlaylist){throw new ApiError(500, "playlist not found!" )}

    // 3. check if the playlist owner is the same as the logged-in user
    if ( !findPlaylist.owner.equals( req.user?._id ) ) { throw new Apierror( 400, "You can't delete this playlist!" ); }

    // 4. delete the playlist
    const playlistDeleted = await Playlist.findByIdAndDelete(playlistId) ; 
    if(!playlistDeleted) {throw new ApiError(500, "playlist not deleted. please try again")}

    return res.status( 200 )
    .json( new ApiResponse( 200, playlistDeleted, "playlist deleted successfully!" ) )
})


//////////////////////// update playlist //////////////////////////
// 1. get playlistId from params URL
// 2. get name and description from req.body
// 3. find the playlist by id
// 4. check if the playlist owner is the same as the logged-in user
// 5. update the playlist
const updatePlaylist = asyncHandler(async (req, res) => {
    // 1. get playlistId from params URL
    // 2. get name and description from req.body

    const {playlistId} = req.params
    const {name, description} = req.body
    if(!isValidObjectId(playlistId)) {throw new ApiError(400, "Invalid playlistId")}
    if(!name && !description) { throw new ApiError(400, "Please providey the name and description ")}
    
    // 3. find the playlist by id 
    const findPlaylist = await Playlist.findById( playlistId )
    if ( !findPlaylist ) { throw new ApiError( 500, "Playlist not found!" ) }

    // 4. check if the playlist owner is the same as the logged-in user
    if ( !findPlaylist.owner.equals( req.user?._id ) ) { throw new Apierror( 400, "You can't update this playlist!" ); }

    // 5. update the playlist
    findPlaylist.name = name
    findPlaylist.description = description

    const playlistUpdated = await findPlaylist.save()
    if ( !playlistUpdated ) { throw new Apierror( 500, "Please try again!" ) }

    return res.status( 200 )
        .json( new ApiResponse( 200, playlistUpdated, "Playlist updated successfully!" ) )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
