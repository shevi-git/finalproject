const mongoose=require("mongoose");


const UserSchema=new mongoose.Schema({
    nameFamily:{type:String,require:true},
    email:{type:String,require:true},
    password:{type:String,require:true},
    appartment:Number,
    role:{type:String,enum:['דייר',"ועד בית"],default:'דייר'},
    createdAt:{type:Date,default:Date.now}
})
module.exports=mongoose.model("UserSchema",UserSchema);