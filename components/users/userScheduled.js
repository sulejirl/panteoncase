let schedule = require('node-schedule');
const User = require('./user');
const {distributeCoin} = require('../../utils/helpers')
var mongoose   = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


  let weeklyJob =  ()=>{
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
              User.updateOne({_id:ObjectId(user._id)},{coin:newCoin,prevRank:k,coinCurrentWeek:0},{upsert:true},(err,result)=>{console.log(result)});
            }
            k++;
          }
        }
      }).sort({coinCurrentWeek:-1})
    })
  }

  let j = schedule.scheduleJob({hour: 0, minute: 0, dayOfWeek: 1}, weeklyJob);

  module.exports.j = j;
