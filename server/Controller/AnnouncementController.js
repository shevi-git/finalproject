const Announcement = require("../Moduls/AnnouncementSchema");
const Users = require("../Moduls/UserSchema");
const bcrypt = require("bcrypt");

async function createAnnouncement(req, res) {
    try {
        console.log("Received request body:", req.body);
        const { title, content, type } = req.body;

        if (!title || !content) {
            console.log("Missing required fields");
            return res.status(400).json({ message: "Title and content are required" });
        }

        // יצירת מודעה חדשה עם השדה createBy שמוגדר כ-ID של המשתמש המחובר
        const newAnnouncement = new Announcement({
            title,
            content,
            type,
            createBy: req.user._id // משתמש מחובר
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

const deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        console.log("Request to delete announcement ID:", id);
        console.log("Request body:", req.body);

        if (!password) {
            return res.status(400).json({ message: "Password is required for deletion" });
        }

        const announcement = await Announcement.findById(id);
        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }

        const user = await Users.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        console.log("User role:", req.user.role);
        console.log("Announcement created by:", announcement.createBy.toString());
        console.log("Current user ID:", req.user._id.toString());

        if (req.user.role !== "houseCommittee" && announcement.createBy.toString() !== req.user._id.toString()) {
            console.log("Permission denied: Not creator or house committee");
            return res.status(403).json({ message: "אין לך הרשאה למחוק את המודעה" });
        }

        await Announcement.findByIdAndDelete(id);
        console.log("Announcement deleted successfully");

        return res.status(200).json({ message: "המודעה נמחקה בהצלחה" });
    } catch (error) {
        console.error("Error in deleteAnnouncement:", error);
        return res.status(500).json({ message: "שגיאת שרת", error: error.message });
    }
};

const verifyAnnouncementOwner = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        console.log("מנסה לאמת בעלות על מודעה:", id);
        console.log("משתמש נוכחי:", req.user._id);

        if (!password) {
            return res.status(400).json({ message: "נדרשת סיסמה לאימות" });
        }

        // מציאת המודעה
        const announcement = await Announcement.findById(id);
        if (!announcement) {
            console.log("מודעה לא נמצאה");
            return res.status(404).json({ message: "המודעה לא נמצאה" });
        }

        console.log("יוצר המודעה:", announcement.createBy);
        console.log("משתמש נוכחי:", req.user._id);
        console.log("תפקיד המשתמש:", req.user.role);

        // מציאת המשתמש
        const user = await Users.findById(req.user._id);
        if (!user) {
            console.log("משתמש לא נמצא");
            return res.status(404).json({ message: "המשתמש לא נמצא" });
        }

        // בדיקת סיסמה
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("סיסמה שגויה");
            return res.status(401).json({ message: "סיסמה שגויה" });
        }

        // בדיקת הרשאות
        const isCreator = announcement.createBy.toString() === req.user._id.toString();
        const isHouseCommittee = req.user.role === "houseCommittee";

        console.log("האם יוצר:", isCreator);
        console.log("האם ועד בית:", isHouseCommittee);

        if (!isCreator && !isHouseCommittee) {
            console.log("אין הרשאות מתאימות");
            return res.status(403).json({ 
                message: "אין לך הרשאה לעדכן מודעה זו",
                details: {
                    isCreator,
                    isHouseCommittee,
                    userRole: req.user.role,
                    announcementCreator: announcement.createBy
                }
            });
        }

        console.log("אימות בוצע בהצלחה");
        return res.status(200).json({ message: "אימות בוצע בהצלחה" });
    } catch (error) {
        console.error("Error in verifyAnnouncementOwner:", error);
        return res.status(500).json({ message: "שגיאת שרת", error: error.message });
    }
};

const updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, type, password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "נדרשת סיסמה לעדכון" });
        }

        // מציאת המודעה
        const announcement = await Announcement.findById(id);
        if (!announcement) {
            return res.status(404).json({ message: "המודעה לא נמצאה" });
        }

        // מציאת המשתמש
        const user = await Users.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "המשתמש לא נמצא" });
        }

        // בדיקת סיסמה
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "סיסמה שגויה" });
        }

        // בדיקת הרשאות
        if (announcement.createBy.toString() !== req.user._id.toString() && req.user.role !== "houseCommittee") {
            return res.status(403).json({ message: "אין לך הרשאה לעדכן מודעה זו" });
        }

        // עדכון המודעה
        announcement.title = title || announcement.title;
        announcement.content = content || announcement.content;
        announcement.type = type || announcement.type;
        announcement.lastUpdated = new Date();

        await announcement.save();

        res.status(200).json({
            success: true,
            message: "המודעה עודכנה בהצלחה",
            announcement
        });

    } catch (error) {
        console.error("Error updating announcement:", error);
        res.status(500).json({
            message: "שגיאה בעדכון המודעה",
            error: error.message
        });
    }
};

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

module.exports = { 
    createAnnouncement, 
    deleteAnnouncement, 
    updateAnnouncement, 
    getAnnouncements, 
    getAnnouncementById,
    verifyAnnouncementOwner
};
