// start slingin' some d3 here.

var boardHeight = 500;
var boardWidth = 1000;

// set up the board
d3.select('.gameboard').insert('svg')
  .attr('width', boardWidth)
  .attr('height', boardHeight);

// array for circle data (picking random sizes within our board)
var circleSpecs = [];

for (var i = 0; i < 101; i++) {
  circleSpecs.push([Math.random() * boardWidth, Math.random() * boardHeight]);
}

// adding circles to the board
d3.select('svg').selectAll('circle').data(circleSpecs).enter()
  .append('circle').attr('cx', function(d) {return d[0];})
  .attr('cy', function(d) {return d[1];})
  .attr('r', 25);
