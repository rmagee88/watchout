//Set up socket & functions
var socket = io('http://localhost:8000');
var enemies;

socket.on('recievePlayerPosition', function (data) {
  console.log(data);
  d3.select('.competitor[data-player-id='+data.id+']')
  .attr('cx', data.position.x)
  .attr('cy', data.position.y);
});

socket.on('updateEnemyLocation', function (data) {
  moveEnemies(data);
});

socket.on('newPlayer', function (data) {
  console.log('Create new player', data);
  createPlayer(true, data.key, data.position);
});
socket.on('removePlayer', function (data) {
  d3.select('[data-player-id='+data+']').remove();
});


var boardHeight = 500;
var boardWidth = 1000;
var highScore = 0;
var currScore = 0;
var numCollisions = 0;
var collision = false;
var imgSrc = 'shuriken.png';
var transitionTime = 2000;

// set up the board
var boardSetup = function() {
  d3.select('.gameboard').insert('svg').attr('width', boardWidth).attr('height', boardHeight);
  d3.select('svg').insert('defs').insert('pattern').insert('image');
  d3.select('pattern').attr('id', 'enemyPattern').attr('width', 15).attr('height', 15).attr('patternUnits', 'objectBoundingBox');
  d3.select('image').attr('width', 30).attr('height', 30).attr('xlink:href', imgSrc);
  createPlayer(false);
};

function createPlayer(enemy, id, currentPosition){
  var player = d3.select('svg').insert('circle').attr('r', 15).attr('cx', boardWidth / 2).attr('cy', boardHeight / 2)

  if (!enemy){
    player.attr('class', 'player').attr('fill', 'green').call(drag);
  }else{
    player.attr('class', 'competitor').attr('fill', 'orange').attr("data-player-id",id);
  }
  console.log(enemy, id, currentPosition);
  if (currentPosition){
    player.attr('cx', currentPosition.x).attr('cy', currentPosition.y);
  }
}


var moveEnemies = function(newEnemyLocations) {
  if (enemies === undefined){
   enemies = d3.select('svg').selectAll('circle.enemy').data(newEnemyLocations).enter().append('circle')
   .attr('r', 15).attr('fill', 'url(#enemyPattern)').attr('class', 'enemy');
  }

  enemies.data(newEnemyLocations).transition().duration(transitionTime).style({ 'opacity': 1})
  .attr('cx', function(d){ return d[0];})
  .attr('cy', function(d){ return d[1];});
};

var dragged = function(d) {
  d3.select(this).attr('cx', d3.event.x).attr('cy', d3.event.y);
  socket.emit('sendPlayerPosition', { x: d3.event.x, y: d3.event.y });
};

var drag = d3.behavior.drag().on('drag', dragged);

boardSetup();
setInterval(checkCollisions, 50);
setInterval(scoreCounter, 1000);





