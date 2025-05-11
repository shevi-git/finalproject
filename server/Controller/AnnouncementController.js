const Announcement = require("../Moduls/AnnouncementSchema");

async function createAnnouncement(req, res) {
    try {
        console.log("Received request body:", req.body);
        const { title, content,type, createBy } = req.body;

        if (!title || !content|| !type) {
            console.log("Missing required fields");
            return res.status(400).json({ message: "Title and content are required" });
        }

        const newAnnouncement = new Announcement({
            title,
            content,
            type,
            createBy: createBy || "ועד הבית"
        });

        console.log("New announcement to save:", newAnnouncement);
        const savedAnnouncement = await newAnnouncement.save();
        console.log("Announcement saved successfully:", savedAnnouncement);

        return res.status(201).json({ 
            message: "Announcement created successfully", 
            newAnnouncement: savedAnnouncement 
        });

    } catch (error) {
        console.error("Error in createAnnouncement:", error);
        return res.status(500).json({ 
            message: "Error creating announcement", 
            error: error.message 
        });
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
        const { title, content, type } = req.body; // הנתונים החדשים מתוך ה-Body

        // מציאת המודעה לפי ID
        const announcement = await Announcement.findById(id);

        if (!announcement) {
            console.log("Announcement not found"); // לוג אם המודעה לא נמצאה
            return res.status(404).json({ message: "Announcement not found" });
        }

        // עדכון המודעה עם הנתונים החדשים
        if (title) announcement.title = title;
        if (content) announcement.content = content;
        if (type) announcement.type = type;
        

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
        console.log("Fetching all announcements");
        const announcements = await Announcement.find().sort({ createDate: -1 });
        console.log("Found announcements:", announcements);
        return res.status(200).json(announcements); // מחזיר ישירות מערך
    } catch (error) {
        console.error("Error in getAnnouncements:", error);
        return res.status(500).json({ 
            message: "Error fetching announcements", 
            error: error.message 
        });
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
