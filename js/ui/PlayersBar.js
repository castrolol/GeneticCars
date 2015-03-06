function PlayersBar() {

	this.iconsContainer = document.querySelector(".icons");
	this.icons = [];
	this.onclick = function() {};
}

PlayersBar.prototype.clear = function() {

	for (var i = 0; i < this.icons.length; i++) {
		delete this.icons[i];
	}
	this.icons = [];
	this.iconsContainer.innerHTML = "";

}

PlayersBar.prototype.updatePlayers = function(drawners) {
	this.clear();
	drawners.forEach((function(drawner, i) {
		var canvas = Thumb.create(drawner, 50);
		var div = document.createElement("div");
		div.class = "icon";
		div.appendChild(canvas);
		div.onclick = (function() {
			this.onclick(drawner.car);
		}).bind(this);

		this.iconsContainer.appendChild(div);

		this.icons.push({
			car: drawner.car,
			canvas: canvas,
			container: div,
			index: i
		});

	}).bind(this));

}



PlayersBar.prototype.update = function() {

	this.icons.sort(function(a, b) {
		if (a.car.maxDistance == b.car.maxDistance) {
			return a.index - b.index;
		}
		return a.car.maxDistance - b.car.maxDistance;
	}).forEach(function(icon, i) {
		icon.container.className = "icon pos-" + (i + 1);
		if (!icon.car.alive) {
			icon.container.className += " death";
		}
	});



}
