const mongoose=require("mongoose");

const ChatMessageSchema=new mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId,ref:'UserSchema'},
    message:String,
    category:{type:String},
    createDate:{type:Date,default:Date.now}
})
module.exports=mongoose.model("ChatMessageSchema",ChatMessageSchema);