function CarDrawner(carPhysics) {

  this.carPhysics = carPhysics;
  this.car = carPhysics.car;
}

CarDrawner.prototype.draw = function(drawnerCtx) {

  var car = this.carPhysics;
  var camera = drawnerCtx.camera;
  var drawner = drawnerCtx.drawner;
  var ctx = drawnerCtx.ctx;

  var zoom = drawnerCtx.zoom;
  var chassisMinDensity = car.car.chassisMinDensity;
  var chassisMaxDensity = car.car.chassisMaxDensity;
  var wheelMinDensity = car.car.wheelMinDensity;
  var wheelMaxDensity = car.car.wheelMaxDensity;


  if (!car.car.alive) {
    return;
  }

  var pos = car.getPosition();

  if (pos.x < (camera.x - 5) || pos.x > (camera.x + 10)) {
    // too far behind, don't draw
    return;
  }


  ctx.strokeStyle = "#444";
  ctx.lineWidth = 1;

  for (var i = 0; i < car.wheels.length; i++) {
    ctx.beginPath();
    wheel = car.wheels[i];
    for (var fix = wheel.GetFixtureList(); fix; fix = fix.m_next) {
      var shape = fix.GetShape();
      var color = Math.round(255 - (255 * (fix.m_density - wheelMinDensity)) /
        wheelMaxDensity).toString();
      var rgbcolor = "rgb(" + color + "," + color + "," + color + ")";
      drawner.drawCircle(wheel, shape.m_p, shape.m_radius, wheel.m_sweep.a,
        rgbcolor);
    }
    ctx.closePath();

  }

  ctx.beginPath();
  var densitycolor = Math.round(100 - (70 * ((car.car.chassisDensity -
    chassisMinDensity) / chassisMaxDensity))).toString() + "%";
  if (car.car.elite) {
    ctx.strokeStyle = "#44c";
    //ctx.fillStyle = "#ddf";
    ctx.fillStyle = "hsl(240,50%," + densitycolor + ")";
  } else {
    ctx.strokeStyle = "#c44";
    //ctx.fillStyle = "#fdd";
    ctx.fillStyle = "hsl(0,50%," + densitycolor + ")";
  }

  var chassis = car.body;
  for (var fix = chassis.GetFixtureList(); fix; fix = fix.m_next) {
    var shape = fix.GetShape();
    drawner.drawVirtualPolygon(chassis, shape.m_vertices, shape.m_vertexCount);
  }

  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  if (car.car.hp) {


    var point = pos;

    var barWidth = drawnerCtx.convert(car.car.hp / car.car.maxHp);
    var barheight = drawnerCtx.convert(0.15);
    var barPos = drawnerCtx.point(point.x - 0.5, point.y + 1);

    var hue = 110 * car.car.hp / car.car.maxHp;
    ctx.fillStyle = "hsl(" + Math.round(hue) + ", 72%, 37%)";
    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.fillRect(barPos.x, barPos.y, barWidth, barheight);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(barPos.x, barPos.y, drawnerCtx.zoom, barheight);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = "12px sans-serif";
    ctx.fillText(car.getDistance() + "m", barPos.x + drawnerCtx.convert(0.5),
      barPos.y -
      drawnerCtx.convert(0.15));
    ctx.fill();
    ctx.closePath();



  }

}
