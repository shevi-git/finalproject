const Family = require('../Moduls/FamilySchema');
const Users = require('../Moduls/UserSchema');
const bcrypt = require('bcrypt');

const createFamily = async (req, res) => {
    console.log('=== Starting createFamily ===');
    console.log('Request body:', req.body);
    console.log('User from token:', req.user);
    
    try {
        // בדיקה שהמשתמש מחובר
        if (!req.user || !req.user._id) {
            console.log('No authenticated user found');
            return res.status(401).json({ 
                message: "נדרשת התחברות למערכת" 
            });
        }

        const { nameFamily, floor, amountChildren, role } = req.body;
        
        // בדיקת שדות חובה
        if (!nameFamily || !floor) {
            console.log('Missing required fields:', { nameFamily, floor });
            return res.status(400).json({ 
                message: "שדות חובה חסרים: שם משפחה וקומה נדרשים" 
            });
        }

        // בדיקת תקינות הקומה
        const floorNum = Number(floor);
        if (isNaN(floorNum) || floorNum < 0 || floorNum > 6) {
            console.log('Invalid floor number:', floor);
            return res.status(400).json({ 
                message: "מספר הקומה חייב להיות בין 0 ל-6" 
            });
        }

        const amountChildrenNum = amountChildren ? Number(amountChildren) : 0;



        if (isNaN(amountChildrenNum) || amountChildrenNum < 0) {
            console.log('Invalid amountChildren value:', amountChildren);
            return res.status(400).json({ 
                message: "מספר ילדים לא תקין" 
            });
        }

        // בדיקת תקינות התפקיד
        const validRole = role || "שכן רגיל";
        if (!["שכן רגיל", "ועד בית"].includes(validRole)) {
            console.log('Invalid role:', role);
            return res.status(400).json({ 
                message: "תפקיד לא תקין" 
            });
        }

        // הכנת הנתונים לשמירה
        const familyData = {
            nameFamily: nameFamily.trim(),
            floor: floorNum,
            amountChildren: amountChildrenNum,
            role: validRole,
            userId: req.user._id // שימוש במזהה המשתמש מהטוקן
        };

        console.log('Creating new family with data:', familyData);

        try {
            const newFamily = new Family(familyData);
            console.log('New family object created:', newFamily);
            
            const savedFamily = await newFamily.save();
            console.log('Family saved successfully:', savedFamily);
            
            return res.status(201).json(savedFamily);
        } catch (saveError) {
            console.error('Error saving family:', saveError);
            
            if (saveError.name === 'ValidationError') {
                return res.status(400).json({ 
                    message: "שגיאת אימות", 
                    details: Object.values(saveError.errors).map(err => err.message)
                });
            }
            throw saveError;
        }
    } catch (error) {
        console.error("Error in createFamily:", error);
        console.error("Error stack:", error.stack);
        
        if (error.code === 11000) {
            return res.status(409).json({ 
                message: "משפחה עם שם זה כבר קיימת במערכת" 
            });
        }

        return res.status(500).json({ 
            message: "שגיאת שרת", 
            error: error.message,
            details: error.stack
        });
    }
};


const updateFamily = async (req, res) => {
    const { id } = req.params;
    const { nameFamily, floor, amountChildren, role, password } = req.body;
    console.log('Updating family:', id);

    if (!password) {
        return res.status(400).json({ message: "נדרשת סיסמה לעדכון" });
    }

    try {
        const family = await Family.findById(id);
        if (!family) {
            return res.status(404).json({ message: "משפחה לא נמצאה" });
        }

        // מציאת המשתמש
        const user = await Users.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "משתמש לא נמצא" });
        }

        // בדיקת הסיסמה
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "סיסמה שגויה" });
        }

        // בדיקת הרשאות
        const isOwner = family.userId.toString() === req.user._id.toString();
        const isHouseCommittee = req.user.role === "ועד בית" || family.role === "ועד בית";

        if (!isHouseCommittee && !isOwner) {
            return res.status(403).json({ message: "רק בעל המשפחה או ועד בית יכולים לעדכן את הפרטים" });
        }

        // עדכון הפרטים
        if (nameFamily !== undefined) family.nameFamily = nameFamily;
        if (floor !== undefined) family.floor = floor;
        if (amountChildren !== undefined) family.amountChildren = amountChildren;
        if (role !== undefined) family.role = role;

        await family.save();
        console.log('Family updated successfully');

        res.status(200).json({ message: "המשפחה עודכנה בהצלחה", family });

    } catch (error) {
        console.error("Error updating family:", error);
        res.status(500).json({ message: "שגיאת שרת", error: error.message });
    }
};

const getAllFamilies = async (req, res) => {
   console.log('=== Starting getAllFamilies ===');
    console.log('Request user:', req.user);
    console.log('Request headers:', req.headers);
    
    try {
        console.log('Querying database for families...');
        const families = await Family.find();
        console.log('Found families:', families);
        
        // תמיד מחזירים מערך, גם אם הוא ריק
        console.log('Sending response with families');
        res.status(200).json(families);
    } catch (error) {
        console.error("Error fetching families:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ message: "Server error" });
    }
}; 
const getFamilyById = async (req, res) => {
    try {
        const family = await Family.findById(req.params.id);
        if (!family) return res.status(404).json({ message: 'לא נמצאה משפחה' });
        res.json(family);
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשרת', error });
    }
};

const deleteFamily = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: "נדרשת סיסמה למחיקה" });
        }

        // מציאת המשתמש במסד הנתונים
        const user = await Users.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "משתמש לא נמצא" });
        }

        // בדיקת הסיסמה
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "סיסמה שגויה" });
        }

        // בודקים אם המשתמש הוא ועד בית או המשפחה עצמה
        const family = await Family.findById(id);
        if (!family) {
            return res.status(404).json({ message: "משפחה לא נמצאה" });
        }

        // בדיקה אם המשתמש הוא ועד בית או המשפחה עצמה
        if (req.user.role !== "houseCommittee" && family.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "אין לך הרשאה למחוק משפחה זו" });
        }

        // אם יש הרשאה למחוק, מבצעים את המחיקה
        await Family.findByIdAndDelete(id);

        return res.status(200).json({ message: "המשפחה נמחקה בהצלחה" });

    } catch (error) {
        console.error("Error in deleteFamily:", error);
        return res.status(500).json({ message: "שגיאה במחיקת המשפחה", error });
    }
};

const verifyPassword = async (req, res) => {
    try {
        const { familyId, password } = req.body;
        console.log('Verifying password for family:', familyId);

        if (!password) {
            return res.status(400).json({ message: "נדרשת סיסמה לאימות" });
        }

        // מציאת המשפחה
        const family = await Family.findById(familyId);
        if (!family) {
            return res.status(404).json({ message: "משפחה לא נמצאה" });
        }

        // מציאת המשתמש
        const user = await Users.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "משתמש לא נמצא" });
        }

        // בדיקת הסיסמה
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "סיסמה שגויה" });
        }

        // בדיקת הרשאות
        const isOwner = family.userId.toString() === req.user._id.toString();
        const isHouseCommittee = req.user.role === "ועד בית" || family.role === "ועד בית";

        if (!isHouseCommittee && !isOwner) {
            return res.status(403).json({ message: "רק בעל המשפחה או ועד בית יכולים לעדכן את הפרטים" });
        }

        return res.status(200).json({ success: true, message: "הסיסמה אומתה בהצלחה" });

    } catch (error) {
        console.error("Error in verifyPassword:", error);
        return res.status(500).json({ message: "שגיאה באימות הסיסמה", error: error.message });
    }
};

const updateAnnouncement = async (req, res) => {
    try {
        const { familyId, announcement } = req.body;
        console.log('Updating announcement for family:', familyId);

        // מציאת המשפחה
        const family = await Family.findById(familyId);
        if (!family) {
            return res.status(404).json({ message: "משפחה לא נמצאה" });
        }

        // בדיקת הרשאות
        const isOwner = family.userId.toString() === req.user._id.toString();
        const isHouseCommittee = req.user.role === "ועד בית" || family.role === "ועד בית";

        if (!isHouseCommittee && !isOwner) {
            return res.status(403).json({ message: "רק בעל המשפחה או ועד בית יכולים לעדכן את המודעה" });
        }

        // עדכון המודעה
        family.announcement = announcement;
        await family.save();
        console.log('Announcement updated successfully');

        res.status(200).json({ success: true, message: "המודעה עודכנה בהצלחה", family });

    } catch (error) {
        console.error("Error updating announcement:", error);
        res.status(500).json({ message: "שגיאה בעדכון המודעה", error: error.message });
    }
};

module.exports = { 
    createFamily, 
    updateFamily, 
    getAllFamilies, 
    getFamilyById, 
    deleteFamily, 
    verifyPassword,
    updateAnnouncement 
};

