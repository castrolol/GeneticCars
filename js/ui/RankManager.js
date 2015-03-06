function RankManager(app) {

	this.app = app;
	this.ranking = [];
	this.limit = 10;

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

	var pic = Thumb.create(drawner, 160);

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
