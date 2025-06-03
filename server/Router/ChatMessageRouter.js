const express = require("express")
const router = express.Router()
const verifyJWT = require("../middleware/verifyJWT")
const { createChatMessage, updateChatMessage, getAllMessages, deleteMessage } = require("../Controller/ChatMessageController")

router.get("/getAllMessages", getAllMessages);
router.post("/createChatMessage", createChatMessage);
router.put("/updateChatMessage", verifyJWT, updateChatMessage);
router.delete("/deleteMessage/:messageId", verifyJWT, deleteMessage);

module.exports = router