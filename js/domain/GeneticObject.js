function prop2string(definition, value) {
  var name = "";

  switch (definition[3]) {
  case "int":
    name += value.toString(32);
    break;
  case "float":

    if (definition[2] < 10) {
      value *= 100;
    }
    name += value.toString(32);
  case "boolean":
    name += value ? "T" : "F";
  }

  return definition[3].charAt(0).toUpperCase() + name;

}


function GeneticObject() {

  this._gens = [];
  this._genDefinitions = {};

  this.defineProperty = function (prop, type, min, max) {

    this._genDefinitions[prop] = [prop, min, max, type];

    var position = this._gens.length;
    this._gens.push(min);

    Object.defineProperty(
      this,
      prop, {
        get: (function () {
            return this._gens[position];
          })
          .bind(this),
        set: (function (value) {
            value = clamp(value, min, max);
            this._gens[position] = value;
          })
          .bind(this)
      }
    );

  }

  this.createName = function () {

    var name = "";
    for (var prop in this._genDefinitions) {

      name += prop2string(this._genDefinitions[prop], this[prop]);

    }

    return name;

  }

  this.normalizeData = function () { //to override



  }

  this.randomizeProperty = function (prop) {

    var property = this._genDefinitions[prop];
    if (!property) return null;

    this[prop] = random(property[3], property[1], property[2]);

    this.normalizeData();

  }

  this.crossWith = function (anotherObject) {

    var gens = this._gens.map(function (gen, i) {

      var useAnother = !!random("bool");

      if (useAnother) {
        return anotherObject._gens[i];
      }

      return gen;

    });

    return gens;

  }

  this.crossOver = function (anotherObject) {
    var newObject = new this.constructor;
    newObject._gens = this.crossWith(anotherObject);
    return newObject;
  }

  this.randomAll = function () {


    for (var prop in this._genDefinitions) {

      this.randomizeProperty(prop);

    }

  }

  this.mutate = function (mutationRate) {

    var mutation = random("float", 0, 1);

    if (mutation > mutationRate) return;

    var props = Object.keys(this._genDefinitions);
    var propIndex = props[random("int", 0, props.length - 1)];
    var property = this._genDefinitions[propIndex];

    this[property[0]] = random(property[3], property[1], property[2]);

  }

}
