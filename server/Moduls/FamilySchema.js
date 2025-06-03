const mongoose = require("mongoose");

const FamilySchema = new mongoose.Schema({
    nameFamily: {
        type: String,
        required: [true, 'שם המשפחה הוא שדה חובה'],
        trim: true
    },
    floor: {
        type: Number,
        required: [true, 'מספר הקומה הוא שדה חובה'],
        min: [0, 'מספר הקומה חייב להיות 0 או יותר'],
        max: [6, 'מספר הקומה לא יכול להיות גדול מ-6']
    },
    amountChildren: {
        type: Number,
        default: 0,
        min: [0, 'מספר הילדים חייב להיות 0 או יותר']
    },
    // type:{type:String,require:true},
    role: {
        type: String,
        enum: ["ועד בית", "שכן רגיל"],
        default: "שכן רגיל"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'מזהה המשתמש הוא שדה חובה']
    },
    announcement: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Family", FamilySchema);

