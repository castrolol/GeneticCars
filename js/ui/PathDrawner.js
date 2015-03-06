function PathDrawner(pathPhysics) {

  this.physicObject = pathPhysics;
  this.path = pathPhysics.path;

}

PathDrawner.prototype.draw = function(drawCtx) {
  var ctx = drawCtx.ctx;
  var zoom = drawCtx.zoom;
  var quantidade = this.physicObject.segments.length;
  var camera = drawCtx.camera;
  var drawner = drawCtx.drawner;

  ctx.strokeStyle = "#666";
  ctx.fillStyle = "#666";
  ctx.lineWidth = 1;
  ctx.beginPath();

  var lastDrawTile = 0;
  outer_loop:
    for (var i = Math.max(0, lastDrawTile - 20); i < quantidade; i++) {
      var s = this.physicObject.segments[i];

      for (var fix = s.GetFixtureList(); fix; fix = fix.m_next) {

        var shape = fix.GetShape();
        var shapePosition = s.GetWorldPoint(shape.m_vertices[0]).x;

        if ((shapePosition > (camera.x - 15)) && (shapePosition < (camera.x +
            15))) {
          drawner.drawVirtualPolygonToFloor(s, shape.m_vertices, shape.m_vertexCount);
        }

        if (shapePosition > camera.x + 15) {
          lastDrawTile = i;
          break outer_loop;
        }
      }
    }

  ctx.stroke();
  ctx.fill();



}
