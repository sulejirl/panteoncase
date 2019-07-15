const router = module.exports = require('express').Router();
const {updateUsersCoin,createUser,getAllUsers,getLeaderboard,test,weeklyUpdate} = require('./usersController')
const {weeklyJob} = require('./userScheduled');

router.put('/updatecoin',updateUsersCoin);
router.post('/',createUser);
router.get('/leaderboard',getLeaderboard)
