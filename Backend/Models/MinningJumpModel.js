const mongoose = require("mongoose");

const MinningJumpSchema = mongoose.Schema({
    user:  { type:mongoose.Schema.Types.ObjectId, ref: "Users",require:true},
    jumps_mine:  { type:Number},
    caloriecoins_mine : { type:Number },
    endtime: { type:Date},
    duration_time : { type:Number },
    kcalorie : { type:Number}
},
    {timestamps: true}
)

module.exports = mongoose.model('MinningJumps',MinningJumpSchema);

