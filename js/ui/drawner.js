function Drawner(ctx, drawCtx) {

  this.drawCtx = drawCtx;
  this.ctx = ctx;
  this.pattern = "rgb(134, 102, 73)";


}

Drawner.prototype.drawVirtualPolygon = function(body, vtx, n_vtx) {
  var ctx = this.ctx;
  var dtx = this.drawCtx;

  var p0 = body.GetWorldPoint(vtx[0]);
  p0 = dtx.point(p0.x, p0.y);

  ctx.moveTo(p0.x, p0.y);
  for (var i = 1; i < n_vtx; i++) {
    var p = body.GetWorldPoint(vtx[i]);
    p = dtx.point(p.x, p.y);

    ctx.lineTo(p.x, p.y);
  }
  ctx.lineTo(p0.x, p0.y);

}

Drawner.prototype.drawVirtualPolygonToFloor = function(body, vtx, n_vtx) {

  var ctx = this.ctx;
  ctx.fillStyle = this.pattern;
  var dtx = this.drawCtx;


  var points = vtx.map(function(tx) {
    var p = body.GetWorldPoint(tx);
    return dtx.point(p.x, p.y);
  });

  points[1].y += 500;
  points[1].x = points[0].x;
  points[2].y += 500;
  points[2].x = points[3].x;



  ctx.moveTo(points[0].x, points[0].y);
  for (var i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.lineTo(points[0].x, points[0].y);

}


Drawner.prototype.drawCircle = function(body, center, radius, angle, color) {
  var ctx = this.ctx;
  var dtx = this.drawCtx;

  var p = body.GetWorldPoint(center);
  p = dtx.point(p.x, p.y);
  radius = dtx.convert(radius);

  ctx.fillStyle = color;

  ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI, true);


  ctx.moveTo(p.x, p.y);
  ctx.lineTo(p.x + radius * Math.sin(angle), p.y + radius * Math.cos(angle));
  ctx.fill();
  ctx.stroke();

}
