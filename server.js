const app = require('./app');
const port = process.env.PORT || 8000;      
const mongoose       = require('mongoose');
mongoose.Promise    =require('bluebird');
const {j} = require('./components/users/userScheduled');

// mLab Connetion
const options ={ keepAlive: 300000, connectTimeoutMS: 30000, useNewUrlParser: true};
const mongoUri = 'mongodb://dbUser:dbPassword1@ds249967.mlab.com:49967/panteoncase'
mongoose.connect(mongoUri,options);
const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));  
 
conn.once('open', () =>{
 console.log('Connected to database')                       
});
