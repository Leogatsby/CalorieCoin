const router = require('express').Router();

const UserModel = require("../Models/UserModel");
const BattleJumpModel = require("../Models/BattleJumpModel");
const { verifyTokenUserAuth } = require("../Middleware/VerifyToken");





// 소켓방에 플레이어2명 다 들어오고 나서 게임이 성립되면
//이 api 콜 보내주세요. 아무리 비동기라지만 서버가 지구 반대편에 있어도 1분안에는 방은 만들어질것입니다.
//룸번호는 "101을 디폴트로 했습니다.로 해주세요.
router.post('/battleStart/:player1/:player2', async (req,res)=>{
    try {
        //배틀소켓방 100번 고정으로 만들고 플레이어2명들여 보냅니다.
        const BattleJump = await BattleJumpModel.create({
            player1: req.paramams.player1,
            player2: req.paramams.player2
        });
        const BattleJumpResult = await BattleJump.save();

        //플레이어1번 유저의 배틀점프 배열 푸쉬 
        await UserModel.findByIdAndUpdate(req.paramams.player1,
            {$push: {BattleJumps:BattleJump}});
        //플레이어2번 유저의 BatlleJumps 배열 푸쉬
        await UserModel.findByIdAndUpdate(req.paramams.player2,
            {$push: {BattleJumps:BattleJump}});
        
        res.json(BattleJumpResult);
    } catch (error) {
        res.send(error)
    }
});

//배틀스타트 했던방의 고유키아이디를 파람으로 전달합니다. 1분배틀이 끝나면 승부결과를 서버로 보내주세요. 비기면 배열로 주셔야합니다. [ 유저1번아이디, 유저2번아이디 ] 이렇게요.유저모델의 배틀포인트와 승부전적은 바디로 전달된 줄넘기 횟수로 분기문 돌려서 구현했어요.
router.put('/battleJudge/:battleJumpId/:player1/:player2', async (req,res)=>{
    try {
        const BattleJump = await BattleJumpModel.findByIdAndUpdate(
            req.params.battleJumpId
            ,{
                player1_jumps : req.body.player1_jumps,
                player2_jumps: req.body.player2_jumps,
                winner: req.body.winner,
                losser: req.body.losser,
                drawers: req.body.drawers
            }
        );
        const BattleJumpResult = await BattleJump.save();

        // 각각의 참여유저마다 승패기록 남기기
        if(req.body.player1_jumps>req.body.player2_jumps){
            //플레이어1의 배틀 포인트 +10 
            await UserModel.findByIdAndUpdate(req.params.player1,
                {$inc: {battle_point: 10}});
            //플레이어1의 이긴전적 +1
            await UserModel.findByIdAndUpdate(req.params.player1,
                {$inc: {win_battles: 1}});
            //플레이어2의 배틀 포인트 -5
            await UserModel.findByIdAndUpdate(req.params.player2,
                {$inc: {battle_point: -5}});
            //플레이어2의 진전적 +1
            await UserModel.findByIdAndUpdate(req.params.player2,
                {$inc: {loose_battles: 1}});
        }else if(req.body.player1_jumps<req.body.player2_jums){
            //플레이어2의 배틀 포인트 +10 
            await UserModel.findByIdAndUpdate(req.params.player2,
                {$inc: {battle_point: 10}});
            //플레이어2의 이긴전적 +1
            await UserModel.findByIdAndUpdate(req.params.player2,
                {$inc: {win_battles: 1}});
            //플레이어1의 배틀 포인트 -5
            await UserModel.findByIdAndUpdate(req.params.player1,
                {$inc: {battle_point: -5}});
            //플레이어1의 진전적 +1
            await UserModel.findByIdAndUpdate(req.params.player1,
                {$inc: {loose_battles: 1}});
        }else{
            //플레이어2의 배틀 포인트 +5 
            await UserModel.findByIdAndUpdate(req.params.player2,
                {$inc: {battle_point: 5}});
            //플레이어2의 비긴전적 +1
            await UserModel.findByIdAndUpdate(req.params.player2,
                {$inc: {draw_battles: 1}});
            //플레이어1의 배틀 포인트 +5
            await UserModel.findByIdAndUpdate(req.params.player1,
                {$inc: {battle_point: 5}});
            //플레이어1의 비긴 전적 +1
            await UserModel.findByIdAndUpdate(req.params.player1,
                {$inc: {draw_battles: 1}});            
        }
        res.json(BattleJumpResult);
    } catch (error) {
        res.json(error)
    }
})

//배틀줄넘기 개인 유저의 참가 기록 
router.get('/:userId', async (req,res)=>{
    try {
        const BattleJumps = await BattleJumpModel.where('kakaoId').equals(req.user.kakaoId)
        .sort({"createdAt":-1});     
        res.json(BattleJumps);
    } catch (error) {
     res.json(error)   
    }
});  

//자기 배틀 전적 승무패 보기   => 배틀로 나중에 이사가자
router.get('/record/:userId', async(req,res)=>{
    try {
        const battleRecord = await UserModel.findById(req.params.userId).select(
        { "win_battles": 1, "draw_battles": 1, "loose_battles" : 1 }).exec();
            res.json(battleRecord);
    } catch (error) {
        res.json(error);   
    }
})

//배틀왕 랭킹 (정렬:배틀포인트(레이팅) )  => 배틀로 나중에 이사가자
router.get('/battleJumpRank', async (req,res)=>{
    try {
        const battleRank = await UserModel.find({})
            .select({
                "nickname":1,
                "profile":1,
                "battle_point":1,
                "win_battles":1,
                "draw_battles":1,
                "loose_battles":1,
               })
            .sort({battle_point:-1});        
         res.json(battleRank);
        } catch (error) {
            res.json(error);
        };
})



module.exports = router;
//방에 자동으로 나가게 한다. => 지금 당장은 모델단 보다는 socket.io및 프론트 처리
/*배틀점프방 만들고 , 유저데이터에 배틀점프 배열 푸쉬
router.post('/:userId', verifyTokenUserAuth,async (req,res)=>{
    try {
        // 1.일단 배틀방을 만든다.
        const BattleRoom = await BattleJumpModel.create({
            roomId : req.params.roomId,

        });
        await BattleRoom.save();
        // 2.방을 만들고 거기에 사람을 넣는다. 만약 2사람이상이면 3번째 사람은 쫓아낸다.
        console.log(BattleRoom.enterUsers);
        if(BattleRoom.enterUsers.lenth<3){
            await BattleJumpModel.updateOne(
                
            )
            //유저도 본인이 참가한 방의 이름을 적는다.

            res.json(BattleRoom);
        }else{
            res.json({message:"배틀방에 이미 2명으로 꽉찼어요"})
        }    
    } catch (error) {
        res.send(error)
    }
}); */