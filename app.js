var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(8080);

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

  socket.broadcast.emit('startGame', io.engine.clientsCount);
  io.sockets.emit('enemyLocations', generateEnemyPosition());

  console.log("SOCKET:");
  console.log(socket.id);

//  socket.broadcast.emit('news', { hello: 'world' });
  socket.on('sendPlayerPosition', function (data) {
      socket.broadcast.emit('recievePlayerPosition', data);
  });

  socket.on('disconnect', function () {
    socket.broadcast.emit('startGame', io.engine.clientsCount);
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

var generateEnemyPosition = function(n, boardWidth, boardHeight){
  n = n || 20;
  boardWidth = boardWidth || 1000;
  boardHeight = boardHeight || 500;
  // array for circle data (picking random sizes within our board)
  var enemyLocations = [];
  for (var i = 0; i <= n; i++) {
    var enemyX = Math.random() * boardWidth;
    var enemyY = Math.random() * boardHeight;
    enemyLocations.push([enemyX, enemyY]);
  }
  return enemyLocations;
};
