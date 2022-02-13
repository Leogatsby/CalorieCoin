const router = require('express').Router();

const MinningJumpModel = require("../Models/MinningJumpModel");
const UserModel = require("../Models/UserModel");
const { verifyTokenUserAuth } = require("../Middleware/VerifyToken");


//기능1.마이닝 생성 (마이닝방번호, 참가시간 ,점프수,칼로리코인획득수,운동시간등)  
//기능2.유저 업데이트 (마이닝모드 참가내역,총 점프한 횟수,칼로리코인 총획득수 등) 
router.post('/:userId', verifyTokenUserAuth, async (req,res)=>{
    try {
        //1.마이닝 점플 
        const MinningJump = await MinningJumpModel.create({
            user: req.params.userid,
            jumps_mine: req.body.jumps_mine,
            caloriecoins_mine: req.body.caloriecoins_mine,
            endtime: req.body.endtime,
            duration_time: req.body.duration_time,
            kcalorie: req.body.kcalorie
        });
        const MinningJumpResult = await MinningJump.save();
        console.log(MinningJumpResult.jumps_mine);

        //01.유저 마이닝점프스 배열 푸쉬
        await UserModel.findByIdAndUpdate(req.params.userId,
            {$push: {MinningJumps:MinningJumpResult}});
        //02.유저 총점프수 업데이트
        await UserModel.findByIdAndUpdate(req.params.userId,
            {$inc: {jumps_mine_total: MinningJumpResult.jumps_mine}});
        //03.유저 총 칼로리코인 업데이트
        await UserModel.findByIdAndUpdate(req.params.userId,
            {$inc: {caloriecoins_mine_total: MinningJumpResult.caloriecoins_mine}});
        //04.유저 총 칼로리 소모량 업데이트
        await UserModel.findByIdAndUpdate(req.params.userId,
            {$inc: {kcalorie_total: MinningJumpResult.kcalorie}});

        const UserJump = await UserModel.findById(req.params.userId)
        .select({
            "MinningJump":1,
            "jumps_mine_total":1,
            "caloriecoins_mine_total":1,
            "kcalorie_total":1
        })
        const UserJumpResult = await UserJump.save();
        res.json({MinningJumpResult,UserJumpResult});
    } catch (error) {
        res.json(error)
    }
});

//유저기준 마이닝 참가내역조회
router.get('/:userId', verifyTokenUserAuth, async (req,res)=>{
    try {
        const MinningJumps = await MinningJumpModel.where('kakaoId')
        .equals(req.user.kakaoId)
        .sort({"createdAt":-1}); //최신순 나열
        
        res.json(MinningJumps);
    } catch (error) {
     res.json(error)   
    }
});  

//마이닝왕 랭킹 (정렬:총칼로리코인 마이닝수) => 마이닝으로 나중에 이사가자
router.get('/minningJumpRank', async (req,res)=>{
    try {
    const minningRank = await UserModel.find({})
        .select({
           "nickname":1,
           "profile":1,
           "caloriecoins_mine_total":1,
           "jumps_mine_total":1
           })
        .sort({caloriecoins_mine_total:-1});
       
     res.json(minningRank);
    } catch (error) {
        res.json(error);
    };
})



module.exports = router;
//const { postAMinningJump,getUserMinnings }= require('../Controllers/MinningJumpController');