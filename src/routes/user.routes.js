import { Router } from "express";
import { loginUser, LogOutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {upload} from '../middlewares/multer.middleware.js'

const router = Router()

router.route('/register').post(
    upload.fields([
        {
           name : "avatar",
           maxCount : 1, 
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser)

router.route('/login').post(loginUser)

// /securesRoutes
router.route('/logout').post( verifyJWT ,LogOutUser)
router.route("/refresh-token").post(refreshAccessToken)



export default router