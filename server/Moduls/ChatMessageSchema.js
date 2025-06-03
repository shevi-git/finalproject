const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: 'כללי'
    },
    createDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);


