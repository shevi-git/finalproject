const Announcement = require("../Moduls/AnnouncementSchema");

async function createAnnouncement(req, res) {
    try {
        // מקבלים את תוכן המודעה מה-body של הבקשה
        const { title, content } = req.body;

        // בודקים אם יש טייטל ותוכן
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        // יוצרים מודעה חדשה
        const newAnnouncement = new Announcement({
            title,
            content,
            // createBy: req.user.id // המידע על המשתמש שמייצר את המודעה מתוך ה-JWT
        });

        // שומרים את המודעה ב-database
        await newAnnouncement.save();

        return res.status(201).json({ message: "Announcement created successfully", newAnnouncement });

    } catch (error) {
        return res.status(500).json({ message: "Error creating announcement", error });
    }
}

async function deleteAnnouncement(req, res) {
    try {
        const { id } = req.params; // מזהה המודעה שצריך למחוק

        // מחפשים את המודעה במסד הנתונים
        const announcement = await Announcement.findById(id);
        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        // בודקים אם המשתמש שמבצע את הפעולה הוא אותו משתמש שיצר את המודעה
        if (announcement.createBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "You do not have permission to delete this announcement" });
        }

        // אם יש הרשאה למחוק, מבצעים את המחיקה
        await Announcement.findByIdAndDelete(id);

        return res.status(200).json({ message: "Announcement deleted successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Error deleting announcement", error });
    }
}


async function updateAnnouncement(req, res) {
    try {
        const { id } = req.params; // מזהה המודעה מתוך ה-URL
        const { title, content } = req.body; // הנתונים החדשים מתוך ה-Body

        // מציאת המודעה לפי ID
        const announcement = await Announcement.findById(id);

        if (!announcement) {
            console.log("Announcement not found"); // לוג אם המודעה לא נמצאה
            return res.status(404).json({ message: "Announcement not found" });
        }

        // עדכון המודעה עם הנתונים החדשים
        if (title) announcement.title = title;
        if (content) announcement.content = content;

        // שמירה של המודעה המעודכנת
        await announcement.save();

        return res.status(200).json({ message: "Announcement updated successfully", announcement });
    } catch (error) {
        console.error("Error during update:", error);  // הדפסת השגיאה לקונסול
        return res.status(500).json({ message: "Error updating announcement", error: error.message });
    }
}

async function getAnnouncements(req, res) {
    try {
        // שולפים את כל המודעות מהמסד נתונים
        const announcements = await Announcement.find().populate('createBy', 'name'); // populate משלים את המידע על המשתמש (אם רוצים שם למשל)
        return res.status(200).json({ announcements });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching announcements", error });
    }
}

async function getAnnouncementById(req, res) {
    try {
        const { id } = req.params; // מזהה המודעה שצריך לשלוף
        const announcement = await Announcement.findById(id).populate('createBy', 'name');
        
        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        return res.status(200).json({ announcement });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching announcement", error });
    }
}

module.exports = { createAnnouncement,deleteAnnouncement,updateAnnouncement,getAnnouncements,getAnnouncementById };
