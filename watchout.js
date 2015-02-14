// start slingin' some d3 here.

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
  d3.select('.gameboard').insert('svg')
    .attr('width', boardWidth)
    .attr('height', boardHeight);

  d3.select('svg').insert('defs').insert('pattern').insert('image');

  d3.select('pattern').attr('id', 'enemyPattern')
    .attr('width', 15).attr('height', 15)
    .attr('patternUnits', 'objectBoundingBox');

  d3.select('image').attr('width', 30).attr('height', 30)
    .attr('xlink:href', imgSrc);

  // adding player's circle
  d3.select('svg').insert('circle')
    .attr('class', 'player')
    .attr('r', 15)
    .attr('fill', 'green')
    .attr('cx', boardWidth / 2)
    .attr('cy', boardHeight / 2)
    .call(drag);
};

var updateEnemies = function(enemyLocations) {
  // n = n || 20;
  // // array for circle data (picking random sizes within our board)
  // var circleSpecs = [];
  // for (var i = 0; i <= n; i++) {
  //   var enemyX = Math.random() * boardWidth;
  //   var enemyY = Math.random() * boardHeight;
  //   var player = d3.select('.player');
  //   var playerLocation = [player.attr('cx'), player.attr('cy')];
  //   // checking proximity don't place on top of player
  //   var proximity = getProximity(playerLocation[0], playerLocation[1], enemyX, enemyY);

  //   if (proximity < 50) {
  //     enemyX = Math.random() * boardWidth;
  //     enemyY = Math.random() * boardHeight;
  //   }

  //   circleSpecs.push([enemyX, enemyY]);
  // }
  d3.select('svg').selectAll('circle.enemy').data(enemyLocations).exit()
    .remove();

  // adding new circles to the board
  d3.select('svg').selectAll('circle.enemy').data(enemyLocations)
    .enter()
    .append('circle')
    .attr('cx', function(d) {return d[0];})
    .attr('cy', function(d) {return d[1];})
    .attr('r', 15)
    .attr('fill', 'url(#enemyPattern)') // url(#enemyPattern)
      .attr('class', 'enemy');

  // updating all circles
  d3.select('svg').selectAll('circle.enemy').data(enemyLocations)
    .attr('cx', function(d) {return d[0];})
    .attr('cy', function(d) {return d[1];});

};

// animate movement of each circle
var moveEnemies = function(newEnemyLocations) {
  d3.select('svg').selectAll('circle.enemy').data(newEnemyLocations)
  .transition()
  .duration(transitionTime)
  .attr('cx', function(d) {return d[0];})
  .attr('cy', function(d) {return d[1];});
};

var checkCollisions = function(){
  var player = d3.select('circle.player');
  var hit = false;
  d3.selectAll('circle.enemy').each(function(enemy){

    var enemyX = d3.select(this).attr("cx");
    var enemyY = d3.select(this).attr("cy");
    var playerX = player.attr("cx");
    var playerY = player.attr("cy");

    var proximity = getProximity(playerX, playerY, enemyX, enemyY);

    if (proximity < 50){
      hit = true;
      if (!collision){
        collision = true;
        handleCollision();
      }
    }
  });

  if (!hit){
    collision = false;
  }
};

var getProximity = function(playerX, playerY, enemyX, enemyY) {
  var xDiff = Math.abs(enemyX - playerX);
  var yDiff = Math.abs(enemyY - playerY);
  return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
};

var handleCollision = function() {
  // reset curr score
  currScore = 0;
  d3.select('.current span').data([currScore])
    .text(function(d) {return d;});
  // do more stuff!
  numCollisions++;
  d3.select('.collisions span').data([numCollisions])
    .text(function(d) {return d;});
};

var scoreCounter = function() {
  currScore++;
  d3.select('.current span').data([currScore])
    .text(function(d) {return d;});
  if (currScore >= highScore) {
    highScore = currScore;
    d3.select('.high span').data([highScore])
    .text(function(d) {return d;});
  }

};

var dragged = function(d) {
  // console.log(d3.event.x, d3.event.y);
    var x = d3.event.x;
    var y = d3.event.y;
    d3.select(this)
    .attr('cx', x)
    .attr('cy', y);

    socket.emit('sendPlayerPosition', { x: x, y: y });


};

var drag = d3.behavior.drag()
  // .origin(function(d) { return d; })
  .on('drag', dragged);

// play the game
boardSetup();
// updateEnemies();
// enemies move every 2 secs
// var moveInterval = setInterval(moveEnemies, transitionTime);
// checking for collisions every 50 ms
setInterval(checkCollisions, 50);
// updating score every second
setInterval(scoreCounter, 1000); // update this based on difficulty





