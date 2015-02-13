// start slingin' some d3 here.

var boardHeight = 500;
var boardWidth = 1000;
var numEnemies = 20;

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
setInterval(function() {
  d3.select('svg').selectAll('circle.enemy')
  .transition()
  .duration(2000)
  .attr('cx', function() {return Math.random() * boardWidth;})
  .attr('cy', function() {return Math.random() * boardHeight;});
}, 2000);

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




