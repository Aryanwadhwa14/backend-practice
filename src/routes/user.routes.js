import {Router} from "express" ;
import { loginUser, logoutUser, registerUser, refreshAccessToken, changeCurrentPassword, upDateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory } from '../controllers/user.controllers.js';
import { upload } from '../middlewares/multer.middleware.js'


const router = Router() 

router.route("/register").post(
    upload.fields([ //middleware injecting (multer)
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }

    ]),
    registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verufyJWT,
changeCurrentPassword)
router.route("/current-user").get(verifyJWT)
router.route("/update-account").patch(verifyJWT,
upDateAccountDetails)
router.route("/avatar").patch(verufyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("/coverImage"), updateUserCoverImage)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile )
router.route("/watchhistory").get(verifyJWT, getWatchHistory)


export default router 