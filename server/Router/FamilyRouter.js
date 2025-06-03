const express = require("express");
const router = express.Router();

const { createFamily, updateFamily, getAllFamilies, getFamilyById, deleteFamily, verifyPassword } = require("../Controller/FamilyController");
const verifyJWT = require("../middleware/verifyJWT");
const { verifyFamilyOwner } = require("../middleware/verifyFamilyOwner");

// נתיבים ספציפיים קודם
router.post("/createFamily", verifyJWT, createFamily);
router.get("/getAllFamilies", verifyJWT, getAllFamilies);

// נתיב חדש לאימות סיסמה
router.post("/verifyPassword", verifyJWT, verifyPassword);

// נתיבים עם פרמטרים אחר כך
router.get("/getFamilyById/:id", verifyJWT, getFamilyById);
router.put("/updateFamily/:id", verifyJWT, updateFamily);
router.delete("/deleteFamily/:id", verifyJWT, verifyFamilyOwner, deleteFamily);

module.exports = router;
