function App() {

  var gravity = new b2Vec2(0, -9.81);
  this.world = new b2World(gravity, true);
  this.camera = new Camera();
  this.objects = [];
  this.zoom = 70;
  this.rank = new RankManager(this);
  this.rank.container = document.querySelector(".ranking");
  this.playersBar = new PlayersBar();

}

App.prototype.setCanvas = function(canvas) {
  this.canvas = canvas;
  this.canvas.style.border = "1px solid #aaf";
  this.ctx = canvas.getContext("2d");


  var grd = this.ctx.createLinearGradient(canvas.width / 2, canvas.height,
    canvas.width / 2,
    0);
  grd.addColorStop(0, "#7DBEFA");
  grd.addColorStop(0.8, "#35ACFC");
  grd.addColorStop(1, "#0071EE");
  this.grd = grd;


}

App.prototype.start = function() {

  var ctx = this.getCtx();
  this._cachedCtx = this;


  var path = new Path();
  path.addTiles();
  var pathPhysic = new PathPhysics(path);
  pathPhysic.world = this.world;
  pathPhysic.apply();
  var pathDrawner = new PathDrawner(pathPhysic);

  var simulator = new Simulator();
  simulator.rank = this.rank;
  simulator.world = this.world;

  simulator
    .setPlayersBar(this.playersBar)
    .createSolver()
    .beginSimulation();


  this.objects.push(this.camera);
  this.objects.push(pathDrawner);
  this.objects.push(simulator);
  this.objects.push(this.playersBar);


  this.loop(ctx);


}

App.prototype.loop = function(ctx) {
  this.world.Step(1 / 60, 20, 20);
  this.beginDraw();
  this.objects.forEach(function(object) {
    if (object.draw) object.draw(ctx);
    if (object.update) object.update(ctx);
  });
  this.closeDraw();

  requestAnimationFrame(this.loop.bind(this, ctx));

}

App.prototype.beginDraw = function() {

  var canvas = this.canvas;
  var ctx = this.ctx;
  var camera = this.camera;
  var zoom = this.zoom;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = this.grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  ctx.translate(200 - (camera.x * zoom), 200 + (camera.y * zoom));
  //ctx.scale(zoom, -zoom);



}

App.prototype.closeDraw = function() {

  this.ctx.restore();

}

App.prototype.getCtx = function() {

  return new DrawContext(this.ctx, this.camera, this.zoom);

}
