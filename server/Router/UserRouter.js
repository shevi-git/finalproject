const express = require("express");
const router = express.Router();
const { register, login, updateUser, deleteUser, getUser, getAllUsers, checkEmail, updateUserRole } = require("../Controller/UserController");

// רישום משתמש חדש
router.post("/register", register);

// התחברות משתמש
router.post("/login", login);

// עדכון פרטי משתמש - מוגן ע"י JWT
router.put("/updateUser", updateUser);

// בדיקת זמינות אימייל
router.post("/checkEmail", checkEmail);

// עדכון מסוגרת משתמש
router.put("/updateRole", updateUserRole);

module.exports = router;
