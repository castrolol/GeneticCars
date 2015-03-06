function DrawContext(ctx, camera, zoom) {

	this.ctx = ctx;
	this.camera = camera;
	this.drawner = new Drawner(this.ctx, this);
	this.zoom = zoom;

	this.point = function(x, y) {
		return {
			x: x * this.zoom,
			y: y * -this.zoom
		};
	}

	this.convert = function(n) {
		return this.zoom * n;
	}

}
