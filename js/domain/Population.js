function Population() {
	this._preparations = [];
	this.cars = [];
}



Population.prototype.addPreparation = function(preparations) {
	var isArray = preparations instanceof Array;

	if (!isArray) {
		preparations = [preparations];
	}

	this._preparations = this._preparations.concat(preparations);

	return this;
}

Population.prototype.setCars = function(cars) {
	this.cars = cars;
	this.cars.forEach(function(car) {
		console.log(car + "")
	});
	return this;
}

Population.prototype.prepare = function() {

	var preparations = this._preparations;
	var population = this;

	this.cars.forEach(function(car) {
		preparations.forEach(function(preparation) {
			preparation(car, population);
		});
	});

	return this;
}

Population.prototype.hasAnyLive = function() {

	return this.cars.some(function(car) {
		return car.alive;
	});

}

Population.init = function(size, preparations) {

	var cars = [];

	for (var i = 0; i < size; i++) {
		var car = new Car(true);
		cars.push(car);
	}

	return new Population()
		.addPreparation(preparations)
		.setCars(cars)
		.prepare();

}


Population.prototype.getFittest = function(onlyAlive) {
	var cars = this.cars;
	if (onlyAlive) {
		cars = cars.filter(function(car) {
			return car.alive;
		});
	}
	return cars.max(function(car) {
		return car.distance;
	});
};

Population.prototype.pickWithTournament = function() {
	var self = this;
	var size = this.cars.length;
	var cars = this.cars;

	var candidates = this.cars.map(function() {
		return cars[random("int", 0, size - 1)];
	});

	return candidates.max(function(car) {
		return car.getDistance();
	});
};


Population.prototype.evolve = function(mutationRate) {

	var self = this;
	var newCars = [];
	var size = this.cars.length;


	var bests = this.cars.sort(function(a, b) {
		return b.distance - a.distance;
	});


	var eliteCar = this.getFittest();
	eliteCar.elite = true;
	newCars.push(eliteCar);


	for (var i = 0; i < 3; i++) {
		for (var j = i + 1; j < 4; j++) {
			var child = bests[i].crossOver(bests[j]);
			newCars.push(child);
		}
	}

	newCars.forEach(function(car, i) {
		if (!i) return;
		car.mutate(mutationRate);
	});

	var toFill = this.cars.length - newCars.length;

	for (var i = 0; i < toFill; i++) {
		var car = new Car(true);
		newCars.push(car.crossOver(this.pickWithTournament()));

	}


	this.cars = this.cars.filter(function(car) {
		return car != eliteCar;
	});


	return new Population()
		.setCars(newCars.slice(0, this.cars.length + 1))
		.addPreparation(this._preparations)
		.prepare();

};


Population.prototype.destroy = function() {
	this.cars.forEach(function(car) {
		car.destroy();
	});
	delete this._preparations;
	delete this.cars;
}
