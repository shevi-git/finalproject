const mongoose=require("mongoose");

const FamilySchema=new mongoose.Schema({
    nameFamily:{type:String,require:true},
    floor:{type:Number,require:true},
    electricity:{type:Number,require:true},
    water:{type:Number,require:true},
    amountChildren:{type:Number,require:true,default:0},
    // type:{type:String,require:true},
    role: { type: String, enum: ["שכן רגיל", "ועד בית"], default: "שכן רגיל" },
    password:{type:Number,require:true}  
})
module.exports=mongoose.model("FamilySchema",FamilySchema);

