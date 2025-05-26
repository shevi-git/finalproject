const mongoose=require("mongoose");


const UserSchema=new mongoose.Schema({
    nameFamily:{type:String,require:true},
    email:{type:String,require:true},
    password:{type:String,require:true},
    role: {type: String, enum: ['resident', 'houseCommittee'], default: 'resident'}
})
module.exports=mongoose.model("UserSchema",UserSchema);