const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const AnnouncementRouter = require("./Router/AnnouncementRouter");
const ChatMessageRouter = require("./Router/ChatMessageRouter");
const registerRouter = require('./Router/UserRouter');
const verifyJwt = require('./middleware/verifyJWT');
const FamilyRouter = require('./Router/FamilyRouter');
dotenv.config();

const app = express();
const cors = require('cors');
app.use(cors());


app.use(bodyParser.json());

// התחברות למסד נתונים
const connectd = process.env.connectDb;

mongoose.connect(connectd)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// ראוטים
app.use("/Family", FamilyRouter);
app.use("/Announcement", AnnouncementRouter);
app.use("/ChatMessage", ChatMessageRouter);
app.use("/user", registerRouter); // שמתי "user" כמו ששלחת
// שים לב: אתה צריך לייבא גם updateUserRouter אם אתה רוצה להשתמש בו!

const PORT = process.env.APP_PORT || 8000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
