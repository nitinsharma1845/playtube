import cookieParser from "cookie-parser";
import cors from 'cors'
import express from "express";

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
})) // app.use use for configure middlewares

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true , limit : "16kb"}))
app.use(express.static('public'))
app.use(cookieParser())

//routes

import userRouter from "./routes/user.routes.js";
import tweetsRouter from './routes/tweets.routes.js'
import videosRouter from './routes/videos.routes.js'

//routes decelartion
app.use("/api/v1/users" , userRouter)
app.use('/api/v1/tweets' , tweetsRouter)
app.use('/api/v1/videos' , videosRouter)

export {app} 
