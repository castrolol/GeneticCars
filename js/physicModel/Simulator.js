function Simulator() {

  this.solver = null;
  this.world = null;
  this.running = false;
  this.cars = [];
  this.drawners = [];
}

Simulator.prototype.setPlayersBar = function(playersBar) {
  this.playersBar = playersBar;
  this.playersBar.onclick = this.setFocus.bind(this);

  return this;
}


Simulator.prototype.createSolver = function() {

  var solver = new Solver(0.05);



  this.solver = solver;

  return this;
}

Simulator.prototype.setFocus = function(car) {

  this.focus = car;

}

Simulator.prototype.createDrawners = function() {
  this.focus = null;

  this.drawners = this.cars.map(function(car) {
    return new CarDrawner(car);
  });
  this.drawners.reverse();
  return this;
}

Simulator.prototype.draw = function(drawCtx) {

  this.drawners.forEach(function(drawner) {
    drawner.draw(drawCtx);
    drawner.car.update(drawCtx);
  });

  return this;
}

Simulator.prototype.update = function(ctx) {

  var camera = ctx.camera;

  var focus = this.focus;

  if (focus && !focus.alive) {
    this.focus = null;
    var focus = null;
  }

  if (!focus) {
    focus = this.solver.population.getFittest(true);
  }

  if (focus) {
    camera.target = focus;
  }
  var population = this.solver.population;
  if (population && !population.hasAnyLive()) {
    this.newIteration();

  }

}

Simulator.prototype.newIteration = function() {


  var car = this.solver.bestSolution;
  var distance = car.distance;

  var bestCarDrawner = this.drawners.filter(function(drawner) {
    return drawner.car == car;
  })[0];

  if (bestCarDrawner) {
    this.rank.update(bestCarDrawner, car.getDistance(), this.solver.generation);
  }

  car.distance = distance;

  this.cars = [];
  this.drawners = [];
  this.solver.population.remenber = car;

  this.solver.endGeneration();
  this.createDrawners();
  this.cars.forEach(function(car) {
    setTimeout(function() {
      if (random("bool")) {
        car.restore();
      }
    }, random("int", 70, 400));
  });
  this.solver.beginGeneration();


  setTimeout((function() {
    this.playersBar.updatePlayers(this.drawners);
  }).bind(this), 100);

}

Simulator.prototype.beginSimulation = function() {

  this.running = true;

  this.cars = [];
  this.drawners = [];

  this.solver.population = Population.init(15, (function(car) {

    var carPhysics = null;
    if (car.physics) {
      car.restore();
      carPhysics = car.physics;
      carPhysics.restore();

    } else {
      carPhysics = new CarPhysics(car);
      carPhysics.world = this.world;

      carPhysics.apply();
    }



    this.cars.push(carPhysics);

  }).bind(this));

  this.createDrawners();

  this.solver.beginGeneration();
  setTimeout((function() {
    this.playersBar.updatePlayers(this.drawners);
  }).bind(this), 100);

}
