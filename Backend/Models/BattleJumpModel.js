const mongoose = require("mongoose");

//Record기록을 더 만들지 말고 그냥 해당 배틀모델 그사람의 승기록이고 , 무승부기록이고 , 패배기록으로 두자.
const BattleJumpModel = mongoose.Schema({
    //배틀스타트 api
    socketRoomId: {type:String,immutable:true, default:101 },
    player1:{  type:mongoose.Schema.Types.ObjectId, ref: "User"},
    player2:{  type:mongoose.Schema.Types.ObjectId, ref: "User"},
    //배틀저지 api
    player1_jumps: {  type:Number ,default:0},
    player2_jumps: {type:Number, default:0},
    winner : {  type:mongoose.Schema.Types.ObjectId, ref: "User"},
    losser : {  type:mongoose.Schema.Types.ObjectId, ref: "User"},
    drawers : [ {  type:mongoose.Schema.Types.ObjectId, ref: "User", default:"승패가 갈린 경기"} ],
},
    {timestamps: true}
)

module.exports = mongoose.model('Battlejumps',BattleJumpModel);
