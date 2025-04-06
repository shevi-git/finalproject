const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const BuildingRouter = require("./Router/BuildingRouter");
const AnnouncementRouter = require("./Router/AnnouncementRouter");
const ChatMessageRouter=require("./Router/ChatMessageRouter");
const registerRouter=require('./Router/UserRouter');
const verifyJwt=require('./middleware/verifyJWT');
dotenv.config();

app.use(bodyParser.json());

const connectd = process.env.connectDb;

mongoose.connect(connectd)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

app.use("/Build", BuildingRouter);
app.use("/Announcement", AnnouncementRouter);
app.use("/ChatMessage",ChatMessageRouter);
app.use("/register",registerRouter);
app.use("/login",loginRouter);
app.use("/update",verifyJwt,updateUserRouter);

const PORT = process.env.APP_PORT || 8080;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});