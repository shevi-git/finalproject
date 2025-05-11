const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
    title: String,
    content: String,
    type:String,
    createBy: String,
    createDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Announcement", AnnouncementSchema);