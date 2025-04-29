const express = require("express");
const router = express.Router();
const { register, login, updateUser, deleteUser } = require("../Controller/UserController");

// רישום משתמש חדש
router.post("/register", register);

// התחברות משתמש
router.post("/login", login);

// עדכון פרטי משתמש - מוגן ע"י JWT
router.put("/update", updateUser);

module.exports = router;
