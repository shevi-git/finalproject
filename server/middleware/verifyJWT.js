const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Users = require("../Moduls/UserSchema");
const Family = require('../Moduls/FamilySchema');

const verifyJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];

        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: 'Forbidden' });
                }

                // מציאת המשתמש במסד הנתונים
                const foundUser = await Users.findById(decoded._id).lean();
                if (!foundUser) {
                    return res.status(401).json({ message: 'User not found' });
                }

                // שמירת כל המידע של המשתמש בבקשה
                req.user = {
                    ...decoded,
                    role: foundUser.role
                };

                next();
            }
        );
    } catch (error) {
        console.error("Error in verifyJWT:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = verifyJWT;
