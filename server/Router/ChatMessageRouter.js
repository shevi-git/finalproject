const express = require("express")
const router = express.Router()

const { createChatMessage}= require("../Controller/ChatMessageController")


router.post("/createChatMessage", createChatMessage);

module.exports= router