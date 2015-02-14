// start slingin' some d3 here.

var boardHeight = 500;
var boardWidth = 1000;
var numEnemies = 20;
var highScore = 0;
var currScore = 0;

var dragged = function(d) {
  // console.log(d3.event.x, d3.event.y);
    var x = d3.event.x;
    var y = d3.event.y;
    d3.select(this)
    .attr('cx', x)
    .attr('cy', y);
};


var drag = d3.behavior.drag()
  // .origin(function(d) { return d; })
  .on('drag', dragged);


// set up the board
d3.select('.gameboard').insert('svg')
  .attr('width', boardWidth)
  .attr('height', boardHeight);

// animate movement of each circle
var moveEnemies = function() {
  d3.select('svg').selectAll('circle.enemy')
  .transition()
  .duration(2000)
  .attr('cx', function() {return Math.random() * boardWidth;})
  .attr('cy', function() {return Math.random() * boardHeight;});
};

var checkCollisions = function(){
  var player = d3.select('circle.player');

  d3.selectAll('circle.enemy').each(function(enemy){

    var enemyX = d3.select(this).attr("cx");
    var enemyY = d3.select(this).attr("cy");
    var playerX = player.attr("cx");
    var playerY = player.attr("cy");

    var xDiff = Math.abs(enemyX - playerX);
    var yDiff = Math.abs(enemyY - playerY);
    var proximity = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))

    if (proximity < 50){
      console.log("Collision!");
      handleCollision();
    }

  });
};

var handleCollision = function() {
  // reset curr score
  currScore = 0;
  d3.select('.current span').data([currScore])
    .text(function(d) {return d;});
  // do more stuff!
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

// enemies move every 2 secs
setInterval(moveEnemies, 2000);
// checking for collisions every 50 ms
setInterval(checkCollisions, 50);
// updating score every second
setInterval(scoreCounter, 1000);

// array for circle data (picking random sizes within our board)
var circleSpecs = [];

for (var i = 0; i <= numEnemies; i++) {
  circleSpecs.push([Math.random() * boardWidth, Math.random() * boardHeight]);
}

// adding circles to the board
d3.select('svg').selectAll('circle').data(circleSpecs).enter()
  .append('circle')
  .attr('cx', function(d) {return d[0];})
  .attr('cy', function(d) {return d[1];})
  .attr('r', 25).attr('class', 'enemy');

// adding player's circle
d3.select('svg').insert('circle')
  .attr('class', 'player')
  .attr('r', 25)
  .attr('fill', 'green')
  .attr('cx', boardWidth / 2)
  .attr('cy', boardHeight / 2)
  .call(drag);




