const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const AnnouncementRouter = require("./Router/AnnouncementRouter");
const ChatMessageRouter = require("./Router/ChatMessageRouter");
const UserRouter = require("./Router/UserRouter");
const FamilyRouter = require("./Router/FamilyRouter"); // הראוטר של משפחות
const cors = require('cors');
dotenv.config();
const weatherRouter = require('./Controller/weatherController');

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log('=== Incoming Request ===');
    console.log('Method:', req.method);
    console.log('URL:', req.originalUrl);
    console.log('Headers:', req.headers);
    next();
});

const connected = process.env.MONGO_URI;

mongoose.connect(connected)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// הגדרת הנתיבים
app.use("/Family", FamilyRouter); // כאן אנחנו מגדירים את הראוטר של משפחות
app.use("/Announcement", AnnouncementRouter);
app.use("/ChatMessage", ChatMessageRouter);
app.use("/User", UserRouter);
app.use('/api', weatherRouter);


const PORT = process.env.APP_PORT || 8000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
