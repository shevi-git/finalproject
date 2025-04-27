const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const AnnouncementRouter = require("./Router/AnnouncementRouter");
const ChatMessageRouter = require("./Router/ChatMessageRouter");
const UserRouter = require("./Router/UserRouter");
const FamilyRouter = require("./Router/FamilyRouter"); // הראוטר של משפחות
const cors =require('cors');
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
    app.use(cors());
// הגדרת הנתיבים
app.use("/Family", FamilyRouter); // כאן אנחנו מגדירים את הראוטר של משפחות
app.use("/Announcement", AnnouncementRouter);
app.use("/ChatMessage", ChatMessageRouter);
app.use("/user", UserRouter);


const PORT = process.env.APP_PORT || 8000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
