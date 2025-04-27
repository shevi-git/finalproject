
const express = require("express")
const router = express.Router()
const verifyJwt = require("../middleware/verifyJWT");
const UserController = require("../Controller/UserController");

const { register, login, updateUser, deleteUser } = require("../Controller/UserController");


router.post("/register", register);
//router.post("/login", login);
router.put("/update", updateUser);

module.exports= router