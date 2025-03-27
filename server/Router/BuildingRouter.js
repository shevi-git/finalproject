const express = require("express")
const router = express.Router()

const { createBuilding}= require("../Controller/BuildingController")


router.post("/createBuilding", createBuilding)


module.exports= router