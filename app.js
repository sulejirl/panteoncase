const express = require('express');
const app = express();
const http = require('http');
const morgan = require('morgan');
const compression = require('compression');
const bodyParser    = require('body-parser');  
const cluster = require('cluster');
const User = require('./components/users');

let workers = [];
const setupWorkerProcesses = () => {
  // to read number of cores on system
  let numCores = require('os').cpus().length;
  console.log('Master cluster setting up ' + numCores + ' workers');
  // iterate on number of cores need to be utilized by an application
  // current example will utilize all of them
  for(let i = 0; i < numCores; i++) {
    // creating workers and pushing reference in an array
    // these references can be used to receive messages from workers
    workers.push(cluster.fork());
    // to receive messages from worker process
    workers[i].on('message', function(message) {
      console.log(message);
    });
  }
  // process is clustered on a core and process id is assigned
  cluster.on('online', function(worker) {
    console.log('Worker ' + worker.process.pid + ' is listening');
  });
  // if any of the worker process dies then start a new one by simply forking another one
  cluster.on('exit', function(worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    console.log('Starting a new worker');
    cluster.fork();
    workers.push(cluster.fork());
    // to receive messages from worker process
    workers[workers.length-1].on('message', function(message) {
        console.log(message);
    });
  });
};
const setUpExpress = () => {
  app.server = http.createServer(app);
  app.all('*', function(req, res, next) {
    let origin = req.get('origin'); 
    res.header('Access-Control-Allow-Origin', origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Credentials", true);
    next();
  });
  app.use(morgan('tiny'));
  app.disable('x-powered-by');
  app.use(bodyParser.json({ limit: '2000kb' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('tiny'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(compression());
  app.use('/users', User)
  // start server
  app.server.listen('8000', () => {
      console.log(`Started server on => http://localhost:${app.server.address().port} for Process Id ${process.pid}`);
  });
  // in case of an error
  app.on('error', (appErr, appCtx) => {
    console.error('app error', appErr.stack);
    console.error('on url', appCtx.req.url);
    console.error('with headers', appCtx.req.headers);
  });
};
const setupServer = (isClusterRequired) => {
  // if it is a master process then call setting up worker process
  if(isClusterRequired && cluster.isMaster) {
    setupWorkerProcesses();
  } else {
    // to setup server configurations and share port address for incoming requests
    setUpExpress();
  }
};
setupServer(true);
module.exports = app;