var boardWidth = 1000;
var boardHeight = 500;

var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

var currentPositions = {};

app.listen(8000);

function handler (req, res) {

  var fileName;

  if (req.url === "/"){
    fileName = "/index.html";
  }else{
    fileName = req.url;
  }

  fs.readFile(__dirname + fileName,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {

  //Get current players
  for(var key in io.sockets.connected){
    if (key !== socket.id){
      var data = {}
      data.key = key;
      data.position = currentPositions[key];
      socket.emit('newPlayer', data);
    }
  }

  //Tell current players
  var d = {};
  d.key = socket.id;
  socket.broadcast.emit('newPlayer', d);

//  socket.broadcast.emit('startGame', io.engine.clientsCount);
//  io.sockets.emit('enemyLocations', generateEnemyPosition());

//  socket.broadcast.emit('news', { hello: 'world' });
  socket.on('sendPlayerPosition', function (data) {
      currentPositions[socket.id] = data;
      console.log(socket.id)
      console.log(data)
      var d = {}
      d.position = data;
      d.id = socket.id;
      socket.broadcast.emit('recievePlayerPosition', d);
  });

  socket.on('disconnect', function () {
    io.sockets.emit('removePlayer', socket.id);
  });
});

setInterval(function() {
    io.sockets.emit('updateEnemyLocation', generateEnemyPosition());
  }, 2000);

var startNewGame = function(socket) {
  // does stuff
  // how many players are there

  // new enemy locations
  // broadcast
  // generateEnemy()
};

var generateEnemyPosition = function(){
  //Generate 20 enemy positions
  var enemyLocations = [];
  for (var i = 0; i <= 20; i++) {
    enemyLocations.push([Math.random() * boardWidth, Math.random() * boardHeight]);
  }

  return enemyLocations;
};
