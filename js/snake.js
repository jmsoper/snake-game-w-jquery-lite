var Coord = function (coord) {
  this.coord = coord;
};

Coord.plus = function (dir) {
  var row = this.coord[0] + dir[0];
  var col = this.coord[1] + dir[1];
  return new Coord([row, col]);
};

Coord.equals = function (pos) {
  return ( this.coord[0] === pos[0] && this.coord[1] === pos[1] );
};

var Snake = function (pos) {
  this.direction = "N";
  this.segments = [new Coord(pos)];
  this.maxLength = 1;
};

Snake.prototype.move = function() {
  deltas = {
    "N": [-1,0],
    "E": [0,1],
    "S": [1,0],
    "W": [0,-1]
  };

  var head = this.segments[ this.segments.length - 1 ];
  this.segments.push( head.plus( this.direction ) );

  if ( this.length() > this.maxLength ) {
    this.segments.shift();
  }
};

Snake.prototype.length = function () {
  return this.segments.length;
};

Snake.prototype.isOppositeDirection = function(dir) {
  oppositeDirs = {
    "N": "S",
    "E": "W",
    "S": "N",
    "W": "E"
  };
  return dir === oppositeDirs[this.direction];
};

Snake.prototype.turn = function(newDir) {
  if ( !this.isOppositeDirection(newDir)) {
    this.direction = newDir;
  }
};

Snake.prototype.grow = function() {
  this.maxLength++;
};

var Board = function (size) {
  var mid = Math.floor( size/2 );
  this.snake = new Snake( [ mid, 0]);
  this.apple = [mid, mid];
};

Board.prototype.over = function() {
  //see if the game is over
  //see if any pos is repeated in the segments array
  //see if any segment has a pos with an x or y greater than size
  //


};

module.exports = Board;
