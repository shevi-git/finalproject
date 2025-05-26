const express = require("express");
const router = express.Router();

const { createFamily, updateFamily, getAllFamilies, getFamilyById, deleteFamily } = require("../Controller/FamilyController");
const verifyJWT = require("../middleware/verifyJWT");
const { verifyFamilyOwner } = require("../middleware/verifyFamilyOwner");

// נתיבים ספציפיים קודם
router.post("/createFamily", verifyJWT, createFamily);
router.get("/getAllFamilies", verifyJWT, getAllFamilies);

// נתיבים עם פרמטרים אחר כך
router.get("/getFamilyById/:id", verifyJWT, getFamilyById);
router.put("/updateFamily/:id", verifyJWT, verifyFamilyOwner, updateFamily);
router.delete("/deleteFamily/:id", verifyJWT, verifyFamilyOwner, deleteFamily);

module.exports = router;
