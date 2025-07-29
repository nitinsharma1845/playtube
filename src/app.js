import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
); // app.use use for configure middlewares

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes

import userRouter from "./routes/user.routes.js";
import tweetsRouter from "./routes/tweets.routes.js";
import videosRouter from "./routes/videos.routes.js";
import commentRouter from "./routes/comments.routes.js";
import playListRouter from "./routes/playlist.routes.js";
import subscriptionRouter from "./routes/subscriptions.routes.js";
import likeRouter from "./routes/like.routes.js"

//routes decelartion
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetsRouter);
app.use("/api/v1/videos", videosRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/playlist", playListRouter);
app.use("/api/v1/subscription", subscriptionRouter);
app.use("/api/v1/likes" , likeRouter)

export { app };
