const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const user=require("../Moduls/UserSchema");
const Family = require('../Moduls/familySchema');

const verifyFamilyOwner = async (req, res, next) => {
    const familyId = req.params.id; // מזהה המשפחה מה-URL
    const userId = req.user._id; // מזהה היוזר מתוך הטוקן

    try {
        const family = await Family.findById(familyId); // חיפוש המשפחה לפי מזהה
        if (!family) {
            return res.status(404).json({ message: "Family not found" });
        }

        // לוודא שהיוזר הוא חלק מהמשפחה
        if (family.password.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You can only update your own family information" });
        }

        next(); // אם הכל תקין, אנחנו יכולים לעדכן
    } catch (error) {
        console.error("Error verifying family owner:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { verifyFamilyOwner };
