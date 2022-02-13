const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
        kakaoId: { type: String, required: true, unique:true ,immutable:true},
        nickname:{type: String},//카카오닉네임
        password:{type: String} ,
        profile:{type: String, default:"카카오프로필주소"}, //카카오프로필
        birthday: {type: String},
        gender : {type: String},
        height: {type: Number},
        weight: {type: Number},
        isAdmin:{type: Boolean, default:false,},
        
        //MinningJump 관련
        MinningJumps: [{ type:mongoose.Schema.Types.ObjectId, ref: "MinningJumps"}],
        jumps_mine_total : {type:Number,default:0},
        caloriecoins_mine_total: {type:Number,default:0},
        kcalorie_total: {type:Number,default:0},
        
        //BattleJump 관련
        BattleJumps: [{ type:mongoose.Schema.Types.ObjectId, ref: "BattleJump"}],
        battle_point : { type: Number ,default:0}, 
        //레이팅 개념 이기면 +10점, 비기면 +5점, 지면 -5점
        
        win_battles:{type:Number,default:0},
        draw_battles:{type:Number,default:0},
        loose_battles:{type:Number,default:0},
        
    },
    {timestamps: true}
)

module.exports = mongoose.model('Users', UserSchema);
//엄청난 데이터 낭비이고, 오류가 날수도 있지만, 인간의 두뇌 생각정리에는 편한 ,유저 기반의 api콜로 구현할수 있는 코드
//대표자는 본래 피트니스필드 종사자로서 창업을 위해 코딩을 하여서 해당코드에 문제가 있음을 알지만, 취직을 목표로 하는것이 아니고 비즈니스로직상에는 문제가 없어서 이렇게 코드를 짯습니다.  동현씨는 이렇게 하면 위믹스에서 좋아할거 같아요? 아니면 깜친다고 보고 괜히 점수 안줄거 같아요?
    // 동현선생님 이 코드 어떻게 생각하세요?
        /*
        win_battles:[{ type:mongoose.Schema.Types.ObjectId, ref: "Battlejumps"}],
        draw_battles:[{ type:mongoose.Schema.Types.ObjectId, ref: "Battlejumps"}],
        loose_battles:[{ type:mongoose.Schema.Types.ObjectId, ref: "Battlejumps"}]
        
        BattleJump: [{ type:mongoose.Schema.Types.ObjectId, ref: "BattleJump"}],
        MinningJump: [{ type:mongoose.Schema.Types.ObjectId, ref: "MinningJump"}],
        Quest: [{ type:mongoose.Schema.Types.ObjectId, ref: "Quest"}],
        Transaction: [{ type:mongoose.Schema.Types.ObjectId, ref: "Transaction"}],
        Wallet: [{ type:mongoose.Schema.Types.ObjectId, ref: "Wallet"}],
        */