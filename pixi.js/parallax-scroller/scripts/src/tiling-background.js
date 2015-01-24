function TilingBackground(file) {
  var texture = PIXI.Texture.fromImage(file);
  PIXI.TilingSprite.call(this, texture, texture.width, texture.height);

  this.viewPortX = 0;
  this.deltaX = 0;
}

TilingBackground.constructor = TilingBackground;
TilingBackground.prototype = Object.create(PIXI.TilingSprite.prototype);

TilingBackground.prototype.setViewPortX = function(x) {
  if (x < this.viewPortX) {
    x += Main.width;
  }
  var units = x - this.viewPortX;
  this.viewPortX = x % Main.width;
  this.tilePosition.x -= (units * this.deltaX);
}
