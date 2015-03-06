function RankManager(app) {

  this.app = app;
  this.ranking = [];
  this.limit = 10;

}

RankManager.prototype.configureCar = function(car) {

  var position = car.body.GetPosition();

  car.wheels.forEach(function(wheel) {
    var wheelPosition = wheel.GetPosition();
    wheel.SetPosition(b2Vec2.Make(wheelPosition.x - position.x,
      wheelPosition.y -
      position.y));

  });
  car.body.SetPosition(b2Vec2.Make(0, 0));

}

RankManager.prototype.verifyPositionInRanking = function(score) {

  var pos = 0;
  for (var i = 0; i < this.ranking.length; i++) {
    if (this.ranking.score > score) {
      pos++;
    }
  }
  return pos + 1;
}

RankManager.prototype.update = function(drawner, score, generation) {

  var positionInRanking = this.verifyPositionInRanking(score);

  if (positionInRanking > this.limit) return;

  var pic = this.createPic(drawner);

  this.ranking.push({
    score: score,
    picture: pic,
    generation: generation
  });

  this.ranking.sort(function(a, b) {

    return b.score - a.score;

  });

  this.ranking = this.ranking.slice(0, this.limit);

  this.drawRanking();

}

RankManager.prototype.drawRanking = function() {


  this.container.innerHTML = "";
  this.ranking.forEach((function(item, i) {

    this.container.appendChild(this.createElement(item, i + 1));

  }).bind(this));
}

RankManager.prototype.createElement = function(item, position) {
  var li = document.createElement("li");
  var h1 = document.createElement("h1");
  var h4 = document.createElement("h4");
  var h6 = document.createElement("h6");
  var canvas = item.picture;
  var span = document.createElement("span");
  var strong = document.createElement("strong");
  var text = document.createTextNode("m");

  /* Structure
   *
   *   <li>
   *     <h1>position</h1>
   *     <h4>gen: position</h4>
   *     <canvas width="160" height="160"></canvas>
   *     <span>
   *       <strong>distance</strong> m
   *     </span>
   *   </li>
   */

  h1.textContent = position;
  h4.textContent = "gen";
  h6.textContent = item.generation;
  strong.textContent = Math.round(item.score * 100) / 100;

  li.appendChild(h1);
  li.appendChild(h4);
  li.appendChild(h6);
  li.appendChild(canvas);
  li.appendChild(span);

  span.appendChild(strong);
  span.appendChild(text);

  return li;

}

RankManager.prototype.createPic = function(drawner) {

  drawner.car.alive = true;
  drawner.car.hp = 0;

  this.configureCar(drawner.carPhysics);


  var newCanvas = document.createElement("canvas");

  newCanvas.width = 160;
  newCanvas.height = 160;


  var ctx = this.createFakeContext(newCanvas);
  this.prepareCanvas(newCanvas, ctx);
  drawner.draw(ctx);
  ctx.ctx.restore();

  drawner.car.alive = false;

  return newCanvas;
}

RankManager.prototype.prepareCanvas = function(canvas, drawCtx) {
  var ctx = drawCtx.ctx;
  var camera = drawCtx.camera;
  var zoom = drawCtx.zoom;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  ctx.translate(80 - (camera.x * zoom), 80 + (camera.y * zoom));
  //ctx.scale(zoom, -zoom);
}

RankManager.prototype.createFakeContext = function(canvas) {

  return new DrawContext(canvas.getContext("2d"), new Camera(), 50);
}
