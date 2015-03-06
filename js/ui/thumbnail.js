(function(w) {


	function ThumbGenerator() {

	}

	ThumbGenerator.prototype.prepareCanvas = function(canvas, drawCtx) {
		var ctx = drawCtx.ctx;
		var camera = drawCtx.camera;
		var zoom = drawCtx.zoom;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();

		ctx.translate(80 - (camera.x * zoom), 80 + (camera.y * zoom));
		//ctx.scale(zoom, -zoom);
	}


	ThumbGenerator.prototype.createThumbContext = function(canvas) {

		return new DrawContext(canvas.getContext("2d"), new Camera(), 50);
	}

	w.Thumb = new ThumbGenerator();

}(window));
