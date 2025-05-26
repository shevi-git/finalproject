const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const user = require("../Moduls/UserSchema");
const Family = require('../Moduls/FamilySchema');

const verifyFamilyOwner = async (req, res, next) => {
    console.log('=== Starting verifyFamilyOwner ===');
    console.log('Family ID:', req.params.id);
    console.log('User from token:', req.user);

    const familyId = req.params.id; // מזהה המשפחה מה-URL
    const userId = req.user._id; // מזהה היוזר מתוך הטוקן

    try {
        const family = await Family.findById(familyId); // חיפוש המשפחה לפי מזהה
        console.log('Found family:', family);
        
        if (!family) {
            console.log('Family not found');
            return res.status(404).json({ message: "משפחה לא נמצאה" });
        }

        // לוודא שהיוזר הוא חלק מהמשפחה או שהוא ועד בית
        if (family.userId.toString() !== userId.toString() && req.user.role !== 'ועד בית') {
            console.log('Unauthorized access attempt');
            console.log('Family userId:', family.userId);
            console.log('Current user id:', userId);
            console.log('Current user role:', req.user.role);
            return res.status(403).json({ message: "אין לך הרשאה לבצע פעולה זו" });
        }

        console.log('Access granted');
        next(); // אם הכל תקין, אנחנו יכולים להמשיך
    } catch (error) {
        console.error("Error verifying family owner:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({ message: "שגיאת שרת", error: error.message });
    }
};

module.exports = { verifyFamilyOwner };
