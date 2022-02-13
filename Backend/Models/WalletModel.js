const mongoose = require("mongoose");

const WalletModel = mongoose.Schema({
    user:  {  type:mongoose.Schema.Types.ObjectId, ref: "User"},
    address : {type:String},
    balance: {  type:Number },
},
    {timestamps: true}
)

const WalletModel = mongoose.model(Wallets, WalletModel);