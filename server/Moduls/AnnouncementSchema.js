const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, required: false }, // אפשר לשנות ל־true אם הוא חובה
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date }
});

module.exports = mongoose.model("Announcement", AnnouncementSchema);
