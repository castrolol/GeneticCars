function Solver(murationRate) {

	Object.defineProperty(this, "bestSolution", {
		get: function () {
			return this.population.getFittest();
		}
	});



	this.generation = 0;
	this.mutationRate = murationRate;

	if ("StopWatch" in window) {
		this.stopWatch = new StopWatch();
	}

	this.solution = new Car(true);
	this.population = null;



}

Solver.prototype.beginGeneration = function () {

	this.generation++;

}

Solver.prototype.endGeneration = function () {

	var newPopulation = this.population.evolve(this.mutationRate);
	this.population.destroy();
	delete this.population;
	this.population = newPopulation;

}
