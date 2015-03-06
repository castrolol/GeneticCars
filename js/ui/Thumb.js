(function(w) {


  function ThumbGenerator() {

  }

  ThumbGenerator.prototype.prepareCanvas = function(canvas, drawCtx) {
    var ctx = drawCtx.ctx;
    var camera = drawCtx.camera;
    var zoom = drawCtx.zoom;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.translate((canvas.width / 2) - (camera.x * zoom), (canvas.width / 2) +
      (camera.y * zoom));
    //ctx.scale(zoom, -zoom);
  }

  ThumbGenerator.prototype.prepareCar = function(car) {

    var values = {};

    var position = car.body.GetPosition();

    values.position = {
      x: position.x,
      y: position.y
    };
    values.wheelsPosition = [];

    car.wheels.forEach(function(wheel) {
      var wheelPos = wheel.GetPosition();

      values.wheelsPosition.push({
        x: wheelPos.x,
        y: wheelPos.y
      });

      var newPos = b2Vec2.Make(wheelPos.x - position.x, wheelPos.y -
        position.y);

      wheel.SetPosition(newPos);

    });

    car.body.SetPosition(b2Vec2.Make(0, 0));

    values.alive = car.car.alive;
    values.hp = car.car.hp;

    car.car.alive = true;
    car.car.hp = 0;

    return values;

  }

  ThumbGenerator.prototype.restoreCar = function(car, values) {

    car.body.SetPosition(b2Vec2.Make(values.position.x, values.position.y));
    car.wheels.forEach(function(wheel, i) {
      var pos = values.wheelsPosition[i];
      wheel.SetPosition(b2Vec2.Make(pos.x, pos.y));
    });
    car.car.alive = values.alive;
    car.car.hp = values.hp;

  };

  ThumbGenerator.prototype.create = function(drawner, size) {


    var values = this.prepareCar(drawner.carPhysics);


    var newCanvas = document.createElement("canvas");

    newCanvas.width = size;
    newCanvas.height = size;


    var ctx = this.createThumbContext(newCanvas, size);
    this.prepareCanvas(newCanvas, ctx);
    drawner.draw(ctx);
    ctx.ctx.restore();

    this.restoreCar(drawner.carPhysics, values);

    return newCanvas;
  }

  ThumbGenerator.prototype.createThumbContext = function(canvas, size) {
    var zoom = Math.round(100 * (size / 3.2)) / 100;
    return new DrawContext(canvas.getContext("2d"), new Camera(), zoom);
  }

  w.Thumb = new ThumbGenerator();

}(window));
