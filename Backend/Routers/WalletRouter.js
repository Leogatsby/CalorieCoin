const router = require('express').Router();
const UserModel = require('../Models/UserModel');

const { verifyTokenUserAuth } = require("../Middleware/VerifyToken");

module.exports = router;