function PathPhysics(path) {

	this.path = path;
	this.segments = [];
}

PathPhysics.prototype.createPhysicSegment = function(segment, pos) {

	var segmentBodyDef = new b2BodyDef();

	segmentBodyDef.position.Set(pos.x, pos.y);

	var segmentBody = this.world.CreateBody(segmentBodyDef);
	var segmentFixDef = new b2FixtureDef();
	segmentFixDef.shape = new b2PolygonShape();
	segmentFixDef.friction = 0.5;

	var center = new b2Vec2(0, 0);
	var coords = segment.coords.map(function(coord) {
		return new b2Vec2(coord[0], coord[1]);
	});

	coords = this.rotateSegment(coords, center, segment.angle);

	segmentFixDef.shape.SetAsArray(coords);
	segmentBody.CreateFixture(segmentFixDef);

	return segmentBody;

};


PathPhysics.prototype.rotateSegment = function(coords, center, angle) {

	var newCoords = [];
	var sin = Math.sin(angle);
	var cos = Math.cos(angle);

	for (var i = 0; i < coords.length; i++) {

		var coord = coords[i];
		var deltaX = (coord.x - center.x);
		var deltaY = (coord.y - center.y);

		newCoords.push({
			x: cos * deltaX - sin * deltaY,
			y: sin * deltaX + cos * deltaY
		});

	}

	return newCoords;


};

PathPhysics.prototype.apply = function() {

	var segments = this.path.segments;
	var physicsSegments = [];

	var position = new b2Vec2(-5, 0);

	for (var i = 0; i < segments.length; i++) {

		var pSeg = this.createPhysicSegment(segments[i], position);
		var fixtures = pSeg.GetFixtureList();
		var nextPosition = pSeg.GetWorldPoint(fixtures.GetShape().m_vertices[3]);
		physicsSegments.push(pSeg);
		position = nextPosition;

	}

	this.segments = physicsSegments;

};
