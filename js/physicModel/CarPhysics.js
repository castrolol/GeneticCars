function CarPhysics(car) {


  this.friction = 1;
  this.restitution = 0.2;
  this.vertexCache = {};
  this.world = null;
  this.motorSpeed = 20;
  this.gravity = new b2Vec2(0, -9.81);

  this.setCar(car);



}

CarPhysics.prototype.setCar = function(car) {

  this.car = car;
  this.car.getPosition = this.getPosition.bind(this);
  this.car.getDistance = this.getDistance.bind(this);
  this.car.getVelocity = this.getVelocity.bind(this);

  this.car.destroy = this.destroy.bind(this);
  this.car.physics = this;
}

CarPhysics.prototype.getVelocity = function() {
  return this.body.GetLinearVelocity();
}

CarPhysics.prototype.getDistance = function() {
  var carPosition = this.getPosition();
  var distance = Math.round(carPosition.x * 100) / 100;
  this.car.distance = distance;
  return distance;
}

CarPhysics.prototype.getPosition = function() {
  return this.body.GetPosition();
}



CarPhysics.prototype.createVertex = function(n) {

  if (this.vertexCache[n]) {
    return this.vertexCache[n];
  }

  var x = 0;
  var y = 0;

  var xProperty = "chassisAxis_" + (n + 1) + "_x";
  var yProperty = "chassisAxis_" + (n + 1) + "_y";

  if (xProperty in this.car) {
    x = this.car[xProperty];
  }

  if (yProperty in this.car) {
    y = this.car[yProperty];
  }

  return new b2Vec2(x, y);

}

CarPhysics.prototype.apply = function() {

  this.chassisDef = new b2BodyDef();
  this.fixDef = new b2FixtureDef();

  this.chassisDef.type = b2Body.b2_dynamicBody;
  this.chassisDef.position.Set(0, 4);

  this.body = this.world.CreateBody(this.chassisDef);

  var density = this.car.chassisDensity;
  var cV = this.createVertex.bind(this);

  this.createChassisPart(cV(0), cV(1), density);
  this.createChassisPart(cV(1), cV(2), density);
  this.createChassisPart(cV(2), cV(3), density);
  this.createChassisPart(cV(3), cV(4), density);
  this.createChassisPart(cV(4), cV(5), density);
  this.createChassisPart(cV(5), cV(6), density);
  this.createChassisPart(cV(6), cV(7), density);
  this.createChassisPart(cV(7), cV(0), density);

  this.createWheels();

  var carMass = this.body.GetMass();

  carMass = this.wheels.reduce(function(agg, wheel) {
    return agg + wheel.GetMass();
  }, carMass)

  this.createJoints(carMass);

}

CarPhysics.prototype.restore = function() {

  this.destroy();
  this.apply();
  this.setCar(this.car);

}

CarPhysics.prototype.createJoints = function(carMass) {

  var joint_def = new b2RevoluteJointDef();

  console.log(this.car.numberOfWheels + " rodas");

  for (var i = 0; i < this.car.numberOfWheels; i++) {

    var propertyAxis = "wheelAxis_" + (i + 1);
    var propertyRadius = "wheelRadius_" + (i + 1);
    var torque = carMass * -this.gravity.y / this.car[propertyRadius];


    var randvertex = this.createVertex(this.car[propertyAxis]);


    joint_def.localAnchorA.Set(randvertex.x, randvertex.y);
    joint_def.localAnchorB.Set(0, 0);
    joint_def.maxMotorTorque = torque;
    joint_def.motorSpeed = -this.motorSpeed;
    joint_def.enableMotor = true;
    joint_def.bodyA = this.body;
    joint_def.bodyB = this.wheels[i];
    var joint = this.world.CreateJoint(joint_def);

  }


}

CarPhysics.prototype.createWheels = function() {
  this.wheels = [];
  for (var i = 0; i < this.car.numberOfWheels; i++) {
    var wheel = this.createWheel(i);
    this.wheels.push(wheel);
  }

}

CarPhysics.prototype.createWheel = function(n) {

  var radius = this.car["wheelRadius_" + (n + 1)];
  var density = this.car["wheelDensity_" + (n + 1)];

  var wheelBodyDef = new b2BodyDef();
  wheelBodyDef.type = b2Body.b2_dynamicBody;
  wheelBodyDef.position.Set(0, 0);

  var wheelBody = this.world.CreateBody(wheelBodyDef);

  var wheelFixDef = new b2FixtureDef();
  wheelFixDef.shape = new b2CircleShape(radius);
  wheelFixDef.density = density;
  wheelFixDef.friction = 1;
  wheelFixDef.restitution = 0.2;
  wheelFixDef.filter.groupIndex = -1;

  wheelBody.CreateFixture(wheelFixDef);

  return wheelBody;

}

CarPhysics.prototype.createChassisPart = function(vertex1, vertex2, density) {

  var vertexes = [];
  vertexes.push(vertex1);
  vertexes.push(vertex2);
  vertexes.push(b2Vec2.Make(0, 0));
  var fixDef = new b2FixtureDef();
  fixDef.shape = new b2PolygonShape();
  fixDef.density = density;
  fixDef.friction = 10;
  fixDef.restitution = 0.2;
  fixDef.filter.groupIndex = -1;
  fixDef.shape.SetAsArray(vertexes, 3);

  this.body.CreateFixture(fixDef);


}


CarPhysics.prototype.destroy = function() {
  var world = this.world;
  this.wheels.forEach(function(body) {
    world.DestroyBody(body);
  });
  world.DestroyBody(this.body);

}
