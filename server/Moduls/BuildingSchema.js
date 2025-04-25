const mongoose=require("mongoose");

const BuildingSchema =new mongoose.Schema({
    nameFamily:{type:mongoose.Schema.Types.ObjectId, ref:'UserSchema'},

})
module.exports=mongoose.model("BuildingSchema",BuildingSchema);