const mongoose=require("mongoose");

const familySchema =new mongoose.Schema({
    nameFamily:{type:mongoose.Schema.Types.ObjectId, ref:'UserSchema'},

})