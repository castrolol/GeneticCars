function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function random(type, min, max) {

  switch (type) {
  case "int":
    return Math.round((Math.random() * (max - min)) + min);
  case "float":
    return ((Math.random() * (max - min)) + min);
  case "bool":
    return !!random("int", 0, 1);
  }

}



//Array extensions
Array.prototype.copy = function () {
  return this.slice(0);
}

Array.prototype.select = function (prop) {
  return this.map(function (item) {
    return item[prop];
  });
}

Array.prototype.max = function (selector) {
  return this.sort(function (a, b) {
    return selector(b) - selector(a);
  })[0];
}

Array.prototype.randomize = function () {

  var size = this.length;
  var itensInArray = 0;
  var newArray = [];
  var emptyObject = {}; //used to mark unique replaceable space

  this.forEach(function () {
    newArray.push(emptyObject);
  }); //create a new array with same size and fill with emptyObject

  this.forEach(function (item) {

    var index = Math.randomInt(0, size - 1);

    while (newArray[index] != emptyObject) {
      index += 1;
      index %= size;
    }

    itensInArray++;
    newArray[index] = item;

  });

  return newArray;
}

Array.prototype.contains = function (element) {
  for (var i = 0; i < this.length; i++) {
    if (element === this[i]) return true;
  }
  return false;
};
