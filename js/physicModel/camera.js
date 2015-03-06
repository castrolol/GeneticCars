function Camera() {
  this.x = -0.1;
  this.y = 0;
  this.speed = 0.05;
  this.target = null;
}


Camera.prototype.update = function() {

  if (this.target == null) {
    return;
  }

  var positionTarget = this.target.getPosition();
  var distance = {
    x: this.x - positionTarget.x + 2,
    y: this.y - positionTarget.y,
  };

  this.x -= distance.x * this.speed;
  this.y -= distance.y * this.speed;

  if (this.x < 0) {
    this.x = 0;
  }

}
