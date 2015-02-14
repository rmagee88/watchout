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
  console.log("SOCKET:")
  console.log(socket.id)

//  socket.broadcast.emit('news', { hello: 'world' });
  socket.on('sendPlayerPosition', function (data) {
      socket.broadcast.emit('recievePlayerPosition', data)
  });
});
