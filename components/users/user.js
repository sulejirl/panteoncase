var mongoose   = require('mongoose');
var Schema     = mongoose.Schema;

var userSchema  = new Schema({
	
    userName:String,
    name:String,
    surname:String,
    mail:String,
    age:Number,
    coin:Number,
    coinCurrentWeek:Number,
    currentRank:Number,
    prevRank:Number,
});
module.exports = mongoose.model('User', userSchema);