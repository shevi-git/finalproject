const express = require("express");
const router = express.Router();

const { createFamily, updateFamily, getAllFamilies, getFamilyById } = require("../Controller/FamilyController");
const { verifyJwt } = require("../middleware/verifyJWT");
const { verifyFamilyOwner } = require("../middleware/verifyFamilyOwner");

router.post("/createFamily", verifyJwt, createFamily);
router.put("/updateFamily/:id", verifyJwt, verifyFamilyOwner, updateFamily);
router.get("/getAllFamilies", getAllFamilies);
router.get('/:id', getFamilyById);


module.exports = router;
