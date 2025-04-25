const express = require("express")
const router = express.Router()

const JWTCheckFamily = require('../middleware/verifyJWT'); // מייבאים את המידלוור של ה-JWT

const { createFamily,updateFamily,getAllFamilies}= require("../Controller/FamilyController")

router.put("updateFamily/:id", updateFamily);
router.post("/createFamily", createFamily)
router.get("/getAllFamilies",getAllFamilies);


module.exports= router