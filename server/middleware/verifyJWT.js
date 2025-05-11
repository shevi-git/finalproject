const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const user=require("../Moduls/UserSchema");
const Family = require('../Moduls/familySchema');
const verifyJwt = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;  
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }  
        const token = authHeader.split(' ')[1];
        if (!token) {
          alert("עליך להתחבר למערכת כדי לבצע שינויים.");
          return; // מונע שליחה אם אין טוקן
      }
        
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            req.user = decoded; // שומרים את המידע על היוזר
            next(); // מעבירים לבקשה הבאה
        });
    } catch (error) {
        console.error("Error in verifyJwt:", error);
        res.status(500).json({ message: "Server error" });
    }
};



module.exports = { verifyJwt};
