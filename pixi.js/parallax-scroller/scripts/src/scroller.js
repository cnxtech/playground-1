function Scroller(stage, renderer) {
  this.viewPortX = 0;

  this.far = new TilingBackground(Main.assetPath(Main.BG_FAR_FILE));
  this.far.deltaX = 0.16;
  stage.addChild(this.far);

  this.mid = new TilingBackground(Main.assetPath(Main.BG_MID_FILE));
  this.mid.position.y = renderer.height - this.mid.height;
  this.mid.deltaX = 0.32;
  stage.addChild(this.mid);

  this.front = new Map();
  this.front.deltaX = 0.64;
  stage.addChild(this.front);
}

Scroller.prototype.setViewPortX = function(x) {
  this.viewPortX = x;

  this.far.setViewPortX(x);
  this.mid.setViewPortX(x);
  this.front.setViewPortX(x);
}

Scroller.prototype.moveViewPortXBy = function(x) {
  var d = (this.viewPortX + x) % Main.width;
  this.setViewPortX(d);
}

