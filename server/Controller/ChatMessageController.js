const ChatMessage = require("../Moduls/ChatMessageSchema");

async function createChatMessage(req, res) {
    try {
        const { sender, message, category } = req.body; // מקבלים את המידע מה-req.body

        const newMessage = new ChatMessage({
            sender, message, category
        });

        await newMessage.save(); // שומרים את ההודעה החדשה ב-MongoDB

        return res.status(201).json({ message: "Chat message created successfully", newMessage });
    } catch (error) {
        console.error("Error creating chat message:", error);
        return res.status(500).json({ message: "Error creating chat message", error: error.message });
    }
}
const updateChatMessage = async (req, res) => {
    try {
        const { messageId, newMessage } = req.body;

        // בדיקה אם כל השדות קיימים
        if (!messageId || !newMessage) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // שליפת ההודעה
        const message = await ChatMessage.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // בדיקה אם המשתמש המחובר הוא השולח
        if (message.sender.toString() !== req.user._id) {
            return res.status(403).json({ message: "You are not allowed to edit this message" });
        }

        // עדכון ההודעה
        message.message = newMessage;
        await message.save();

        res.json({ message: "Message updated successfully", updatedMessage: message });
    } catch (error) {
        console.error("Error in updateChatMessage:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const deleteChatMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        // בדיקה אם ההודעה קיימת        
        const message = await ChatMessage.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }   

        // בדיקה אם המשתמש המחובר הוא השולח
        if (message.sender.toString() !== req.user._id) {
            return res.status(403).json({ message: "You are not allowed to delete this message" });
        }       

        // מחיקת ההודעה
        await ChatMessage.findByIdAndDelete(messageId);

        res.json({ message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error in deleteChatMessage:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const getAllMessages = async (req, res) => {
    try {
        const { familyId } = req.params;

        // שליפת כל ההודעות של המשפחה
        const messages = await ChatMessage.find({ familyId })
            .populate('sender', 'firstName lastName') // שליפת פרטי השולח
            .sort({ createdAt: -1 }); // מיון לפי תאריך יצירה - החדש ביותר קודם

        res.json(messages);
    } catch (error) {
        console.error("Error in getAllMessages:", error);
        res.status(500).json({ message: "Server error" });
    }
};




module.exports = { createChatMessage,updateChatMessage,deleteChatMessage,getAllMessages };
