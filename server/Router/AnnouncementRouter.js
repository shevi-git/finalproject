const express = require("express");
const router = express.Router();

const verifyJWT = require("../middleware/verifyJWT");
const {
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  verifyAnnouncementOwner
} = require("../Controller/AnnouncementController");

// אימות JWT לכל הראוטים
router.use(verifyJWT);

// יצירת מודעה חדשה
router.post("/createAnnouncement", createAnnouncement);

// מחיקת מודעה לפי ID
router.delete("/deleteAnnouncement/:id", deleteAnnouncement);

// עדכון מודעה
router.put("/updateAnnouncement/:id", updateAnnouncement);

// אימות בעלות על מודעה
router.put("/verifyAnnouncementOwner/:id", verifyAnnouncementOwner);

// קבלת כל ההודעות
router.get("/getAnnouncements", getAnnouncements);

// קבלת הודעה בודדת לפי ID
router.get("/getAnnouncementById/:id", getAnnouncementById);

module.exports = router;
