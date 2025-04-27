const express = require("express");
const https = require("https");
const fs = require("fs");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const BuildingRouter = require("./Router/BuildingRouter");
const AnnouncementRouter = require("./Router/AnnouncementRouter");
const ChatMessageRouter = require("./Router/ChatMessageRouter");
const UserRouter = require("./Router/UserRouter"); // כאן, מייבא את הראוטר של המשתמשים
const verifyJwt = require('./middleware/verifyJWT');

dotenv.config();

// טוען את התעודות
const options = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem')
};

app.use(bodyParser.json());

const connectd = process.env.connectDb;

mongoose.connect(connectd)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// הגדרת הנתיבים
app.use("/Build", BuildingRouter);
app.use("/Announcement", AnnouncementRouter);
app.use("/ChatMessage", ChatMessageRouter);
app.use("/user", UserRouter);  // שינוי כאן, כל הנתיבים של המשתמשים תחת /user

// יצירת השרת ב-HTTPS
const PORT = process.env.APP_PORT || 8080;
https.createServer(options, app).listen(PORT, () => {
    console.log("HTTPS Server running on port", PORT);
});
