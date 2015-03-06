function Path() {

	this.segments = [];
	this.maxSegments = 200;
	this.pieceWidth = 1.5;
	this.pieceHeight = 0.15;

}

Path.prototype.begin = function() {

	this.addTiles();

};

function PathSegment(angle) {

	this.coords = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0]
  ];

	this.angle = 0;
}

Path.prototype.addTiles = function() {

	var segment = null;

	for (var i = 0; i < this.maxSegments; i++) {

		segment = new PathSegment();
		segment.coords[1][1] = -this.pieceHeight;
		segment.coords[2][0] = this.pieceWidth;
		segment.coords[2][1] = -this.pieceHeight;
		segment.coords[3][0] = this.pieceWidth;
		segment.angle = (Math.random() * 3 - 1.5) * 1.5 * i / this.maxSegments;
		this.segments.push(segment);
	}

};
