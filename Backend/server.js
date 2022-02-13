const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
require('./Config/db')();

app.use(express.urlencoded({ extended: false }))
app.use(express.json());

// 라우터 설정
const UserRouter = require("./Routers/UserRouter");
const MinningJumpRouter = require("./Routers/MinningJumpRouter");
const BattleJumpRouter = require("./Routers/BattleJumpRouter");
const WalletRouter = require("./Routers/WalletRouter");

app.use('/api/user', UserRouter); 
app.use('/api/minningJump', MinningJumpRouter);
app.use('/api/battleJump', BattleJumpRouter); 
app.use('/api/wallet', WalletRouter); 
 

//소켓닷이아오 설정
const PORT = process.env.PORT || 7000
app.listen(PORT,console.log(`칼로리코인(런메이트) 중앙서버작동 => by ${process.env.NODE_ENV} , http:localhost:${PORT}`));

//const AuthRouter = require("./Routers/AuthRouter"); 유저랑 통합
//app.use('/api/auth', AuthRouter);  유저랑 통합