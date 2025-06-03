const ChatMessage = require("../Moduls/ChatMessageSchema");
const mongoose = require("mongoose");

// יצירת הודעת צ'אט חדשה
const createChatMessage = async (req, res) => {
    try {
        const { sender, senderName, message, category } = req.body;
        console.log("Received message data:", { sender, senderName, message, category });

        if (!mongoose.Types.ObjectId.isValid(sender)) {
            return res.status(400).json({ message: "Invalid sender ID" });
        }

        const newMessage = new ChatMessage({
            sender,
            senderName,
            message,
            category: category || 'כללי'
        });
        console.log("Created new message object:", newMessage);
        
        await newMessage.save();
        console.log("Saved message to database:", newMessage);

        return res.status(201).json({ message: "Chat message created successfully", newMessage });
    } catch (error) {
        console.error("Error creating chat message:", error);
        return res.status(500).json({ message: "Error creating chat message", error: error.message });
    }
};

// שליפת כל ההודעות
const getAllMessages = async (req, res) => {
    try {
        const messages = await ChatMessage.find()
            .select('sender senderName message category createDate');
        console.log("Retrieved messages:", messages);

        return res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ message: "Error fetching messages", error: error.message });
    }
};

// מחיקת הודעה
const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await ChatMessage.findById(messageId);
        
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // בדיקה אם המשתמש המחובר הוא השולח או ועד בית
        if (message.sender.toString() !== req.user._id.toString() && req.user.role !== "houseCommittee") {
            return res.status(403).json({ message: "You are not allowed to delete this message" });
        }

        await message.deleteOne();
        return res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error deleting message:", error);
        return res.status(500).json({ message: "Error deleting message", error: error.message });
    }
};

// עדכון הודעת צ'אט קיימת
const updateChatMessage = async (req, res) => {
    try {
        const { messageId, newMessage } = req.body;

        if (!messageId || !newMessage) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const message = await ChatMessage.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // בדיקת הרשאה - המשתמש המחובר הוא השולח
        if (message.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not allowed to edit this message" });
        }

        message.message = newMessage;
        await message.save();

        return res.json({ message: "Message updated successfully", updatedMessage: message });
    } catch (error) {
        console.error("Error updating chat message:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    createChatMessage,
    getAllMessages,
    updateChatMessage,
    deleteMessage
};


