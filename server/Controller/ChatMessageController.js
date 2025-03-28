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

module.exports = { createChatMessage };
