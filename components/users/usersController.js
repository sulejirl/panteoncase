const User = require('./user');
const {randomUserName,randomAge,randomCoin,distributeCoin} =require('../../utils/helpers')
var mongoose   = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  updateUsersCoin: function(req,res){
    User.findById(req.body.id, {coin:1,coinCurrentWeek:1}, function (err, user) {
      if(err){res.send(err)}
      else {
        if(user.coin === Number(req.body.coin)){
          console.log('No Operation needed');
        } else {
          let difference = user.coinCurrentWeek;
          if(Number(req.body.coin) - user.coin >0){
            difference +=(Number(req.body.coin)-user.coin);
          }
          User.updateOne({_id:req.body.id},{coin:req.body.coin, coinCurrentWeek:difference}, (err,result)=> {
            if(err){console.log(err)}
            else {console.log(result)};
          })
        }
      }
    });
  },
  createUser: async(req,res)=>{
    let user = new User();
    user.userName = randomUserName(8);
    user.name = randomUserName(5);
    user.surname = randomUserName(5);
    user.mail = randomUserName(5);
    user.age = randomAge();
    user.coin = randomCoin();
    user.coinCurrentWeek = 0;
    user.prevRank = null;
    try {
      user.save(function(err,result){
          if(err){
              res.send(err);
          } else {
              res.send(result);
          } 
      });
    } catch(err){
      res.send(err);
    } 
  },
  getLeaderboard:(req,res)=>{
    User.find({},{userName:1,age:1,coinCurrentWeek:1,_id:1,prevRank:1},(err,users)=>{
      if(err){res.send(err)}
      else{
        let result = {};
        let top100 = [];
        let me = {};
        let mePlus3Minus2 = [];
        const index = users.map(e => e._id.toString()).indexOf(req.query.id);
        for(let i = 0;i<100;i++){
          let tempUser = {};
          tempUser._id=users[i]._id
          tempUser.userName = users[i].userName;
          tempUser.age =users[i].age;
          tempUser.coinCurrentWeek=users[i].coinCurrentWeek;
          tempUser.rankDifference = users[i].prevRank - i
          top100.push(tempUser)
        }
        me._id =users[index]._id;
        me.userName =users[index].userName;
        me.age = users[index].age;
        me.coinCurrentWeek = users[index].coinCurrentWeek;
        me.rankDifference = users[index].prevRank - index;
        let i = 0;
        if(index-3 <0){
          i = 0;
        } else {
          i = index-3;
        }
        let limit = 0;
        if(index+2 >users.length){
          limit = users.length;
        } else {
          limit = index+2;
        }
        for (;i<limit;i++){
          let tempUser = {};
          tempUser._id=users[i]._id
          tempUser.userName = users[i].userName;
          tempUser.age =users[i].age;
          tempUser.coinCurrentWeek=users[i].coinCurrentWeek;
          tempUser.rankDifference = users[i].prevRank - i
          mePlus3Minus2.push(tempUser);
        }
        
        result.myrank = index+1;
        result.top100 = top100;
        result.mePlus3Minus2 =mePlus3Minus2;
        result.me =me
        res.send(result);
        
      }
    }).sort({coinCurrentWeek:-1})
  },
  weeklyUpdate:(req,res)=>{
    User.aggregate([
      {$group : {
        _id : null,
        totalUser : {$sum : 1},    //counts the number
        coinCurrentWeek : {$sum : '$coinCurrentWeek'}    //sums the amount
      }}
    ], 
    (err,result)=>{
      let prizes = distributeCoin(result[0].coinCurrentWeek)
      User.find(function (err, users) {
        if (err) {console.log(err)} else {
        let k = 1;
          for(let user of users){
            if(k>100){
              User.updateOne({_id:ObjectId(user._id)},{prevRank:k,coinCurrentWeek:0},{upsert:true},(err,result)=>{});
            } else {
              let newCoin = user.coin + prizes[k-1];
              User.updateOne({_id:ObjectId(user._id)},{coin:newCoin,prevRank:k,coinCurrentWeek:0},{upsert:true},(err,result)=>{});
            }
            k++;
          }
        }
      }).sort({coinCurrentWeek:-1})
    })
  }
}