const express = require("express")
const router = express.Router()

const { createChatMessage,updateChatMessage}= require("../Controller/ChatMessageController")




router.post("/createChatMessage", createChatMessage);
router.put("/updateChatMessage", updateChatMessage);


module.exports= router