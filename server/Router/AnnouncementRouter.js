const express = require("express")
const router = express.Router()
const verifyJWT = require("../middleware/verifyJWT")

const { createAnnouncement,deleteAnnouncement,updateAnnouncement,getAnnouncements,getAnnouncementById}= require("../Controller/AnnouncementController")

// הוספת middleware אימות לכל הראוטים
router.use(verifyJWT);

router.post("/createAnnouncement", createAnnouncement);
router.delete("/deleteAnnouncement/:id", deleteAnnouncement);
router.put("/updateAnnouncement/:id", updateAnnouncement);
router.get("/getAnnouncements", getAnnouncements);
router.get("/getAnnouncementById/:id", getAnnouncementById);

module.exports= router