MAX_HP = 400;
var CarId = 0;

function Car(isRandom) {

	this.id = ++CarId;

	this.toString = function() {
		var retorno = "Car " + this.id;
		if (this.elite) retorno += " (elite)"
		return retorno;
	}


	GeneticObject.apply(this);

	this.alive = true;
	this.elite = false;
	this.hp = MAX_HP;
	this.maxHp = MAX_HP;

	this.chassisMinDensity = 30;
	this.chassisMaxDensity = 300;

	this.wheelMinDensity = 40;
	this.wheelMaxDensity = 100;
	this.defineAllProperties();
	this.maxPosition = 0;
	this.maxDistance = 0;
	this.distance = 0;

	this.normalizeData = function() {


		var choosedAxis = [1, 2, 3];
		var freeAxis = [];
		for (var i = 0; i < 8; i++) {
			freeAxis.push(true);
		}


		for (var i = 0; i < choosedAxis.length; i++) {
			var n = random("int", 0, 7);

			while (!freeAxis[n]) {
				n = random("int", 0, 7);
			}

			freeAxis[n] = false;
			choosedAxis[i] = n;
		}

		this.wheelAxis_1 = choosedAxis[0];
		this.wheelAxis_2 = choosedAxis[1];
		this.wheelAxis_3 = choosedAxis[2];

	};

	if (isRandom) {
		this.randomAll();
	}



}

Car.prototype.restore = function() {

	this.alive = true;
	this.hp = MAX_HP;
	this.maxHp = MAX_HP;
	this.maxDistance = -0.1;
}

Car.prototype.update = function() {
	this.distance = this.getDistance();

	this.updateHealth();

}

Car.prototype.updateHealth = function() {

	if (!this.alive) {
		this.hp = 0;
		return;
	}

	if (this.hp <= 0) {
		this.alive = false;
		return;
	}

	if (this.elite) {
		debugger;
	}

	var actualDistance = this.getDistance();

	if (actualDistance > this.maxDistance + 0.2) {
		this.hp = this.maxHp;
		this.maxDistance = this.getDistance();
		return;
	}



	if (Math.abs(this.getVelocity()) < 0.75) {
		this.hp -= 5;
	}

	this.hp--;
	if (this.hp / this.maxHp < 0.75 && this.maxHp > (MAX_HP * 0.3)) {
		this.maxHp *= 0.75;
		this.hp *= 0.75;
	}
}

Car.prototype.getVelocity = function() { //will be overrided
	return 0;
}

Car.prototype.getDistance = function() { //will be overrided
	return 0;
}

Car.prototype.defineAllProperties = function() {

	this.defineProperty("seedOfWheels", "int", 0, 30);

	Object.defineProperty(this, "numberOfWheels", {
		get: function() {

			return Math.max(1, Math.round(Math.log10(this.seedOfWheels) *
				1.74 - 0.025));
		}
	});

	//this.numberOfWheels = 2;

	this.defineProperty("wheelRadius_1", "float", 0.2, 0.5);
	this.defineProperty("wheelRadius_2", "float", 0.2, 0.5);
	this.defineProperty("wheelRadius_3", "float", 0.2, 0.5);

	this.defineProperty("wheelDensity_1", "int", 40, 100);
	this.defineProperty("wheelDensity_2", "int", 40, 100);
	this.defineProperty("wheelDensity_3", "int", 40, 100);

	this.defineProperty("wheelAxis_1", "int", 0, 7);
	this.defineProperty("wheelAxis_2", "int", 0, 7);
	this.defineProperty("wheelAxis_3", "int", 0, 7);


	this.defineProperty("chassisAxis_1_x", "float", 0.1, 1.1);

	this.defineProperty("chassisAxis_2_x", "float", 0.1, 1.1);
	this.defineProperty("chassisAxis_2_y", "float", 0.1, 1.1);

	this.defineProperty("chassisAxis_3_y", "float", 0.1, 1.1);

	this.defineProperty("chassisAxis_4_x", "float", -1.1, -0.1);
	this.defineProperty("chassisAxis_4_y", "float", 0.1, 1.1);

	this.defineProperty("chassisAxis_5_x", "float", -1.1, -0.1);

	this.defineProperty("chassisAxis_6_x", "float", -1.1, -0.1);
	this.defineProperty("chassisAxis_6_y", "float", -1.1, -0.1);

	this.defineProperty("chassisAxis_7_y", "float", -1.1, -0.1);

	this.defineProperty("chassisAxis_8_x", "float", 0.1, 1.1);
	this.defineProperty("chassisAxis_8_y", "float", -1.1, -0.1);

	this.defineProperty("chassisDensity", "int", this.chassisMinDensity, this.chassisMaxDensity);

}
