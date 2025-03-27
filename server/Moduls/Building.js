const mongoose=require("mongoose")

const SchemaBuilding=mongoose.Schema({
    nameFamily:{type:String,require:true},
    floor:{type:Number,require:true},
    electricity:{type:Number,require:true},
    water:{type:Number,require:true},
    amountChildren:{type:Number,require:true,default:0},
    type:{type:String,require:true}
})
module.exports=mongoose.model("Building",SchemaBuilding);
