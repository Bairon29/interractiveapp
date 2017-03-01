const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');
const methodOver = require('method-override');
/* BCrypt stuff here */
const bcrypt = require('bcrypt');

const server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var users = [];
var connections = [];

server.listen(process.env.PORT || 3000);
console.log("server running in port 3000");

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/viewsFile');
app.use("/", express.static(__dirname + '/public'));
app.use(methodOver('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.use(session({
  secret: 'theTruthIsOutThere51',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.get('/', function(req, res){
  res.render('index.html');
});

io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('connected: %s sockets connected', connections.length);

  socket.on('disconnect', function(data){
 connections.splice(connections.indexOf(socket), 1);
  console.log('Disconnected: %s sockets connected', connections.length);
  });

  socket.on('send message', function(data){
    io.sockets.emit('new message', {msg: data});
  })



});


//change to the correct database
// var db = pgp(process.env.DATABASE_URL || 'postgres://student_02@localhost:5432/SecondPro_db');

// var port = process.env.PORT || 3000;

// app.listen(port, function() {
//   console.log('Node app is running on port ', port);
// });
