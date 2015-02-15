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