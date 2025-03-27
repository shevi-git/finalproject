const mongoose=require("mongoose");

const AnnouncementSchema=new mongoose.Schema({
    title:String,
    content:String,
    createBy:{type:mongoose.Schema.Types.ObjectId,ref:'UserSchema'},
    createDate:{type:Date,default:Date.now}
})
module.exports=mongoose.model("AnnouncementSchema",AnnouncementSchema);