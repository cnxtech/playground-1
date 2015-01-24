function Main() {
  this.stage = new PIXI.Stage(0x000000);
  this.renderer = PIXI.autoDetectRenderer(Main.width, Main.height);

  this.scrollSpeed = 4;

  document.getElementsByClassName('container')[0].appendChild(this.renderer.view);

  var assetsToLoad = [Main.WALL_FILE, Main.BG_FAR_FILE, Main.BG_MID_FILE];
  this.loader = new PIXI.AssetLoader(Main.assetize(assetsToLoad));
  this.loader.onComplete = this.onAssetsLoaded.bind(this);
  this.loader.load();
}

Main.BG_FAR_FILE = 'bg-far.png'
Main.BG_MID_FILE = 'bg-mid.png'
Main.WALL_FILE = 'wall.json'

Main.width = 512;
Main.height = 384;


Main.assetize = function(arr) {
  return arr.map(Main.assetPath);
}

Main.assetPath = function(file) {
  return 'assets/img/' + file;
}

Main.prototype.onAssetsLoaded = function() {
  this.pool = new ObjectPool();
  this.scroller = new Scroller(this.stage, this.renderer);

  this.initGUI();

  requestAnimFrame(this.draw.bind(this));
}

Main.prototype.draw = function() {
  requestAnimFrame(this.draw.bind(this));

  this.scroller.moveViewPortXBy(this.scrollSpeed);

  this.renderer.render(this.stage);
}

Main.prototype.initGUI = function() {
  var gui = new dat.GUI();
  gui.add(this, 'scrollSpeed', 0, 50);

  var far = gui.addFolder('Far Plane');
  far.add(this.scroller.far, 'deltaX', -1, 1);
  far.open();

  var mid = gui.addFolder('Mid Plane');
  mid.add(this.scroller.mid, 'deltaX', -1, 1);
  mid.open();
}

Main.prototype.borrowWallSprites = function(n) {
  for (var i = 0; i < n; i++) {
    var sprite;
    if (i % 2 == 0) {
      sprite = this.pool.borrowWindow();
    } else {
      sprite = this.pool.borrowDecoration();
    }
    sprite.position.x = -32 + (i * 64);
    sprite.position.y = 128;

    this.wallSlices.push(sprite);
    this.stage.addChild(sprite);
  }
}

Main.prototype.returnWallSprites = function() {
  var len = this.wallSlices.length;
  for (var i = 0; i < len; i++) {
    var sprite = this.wallSlices[i];

    this.stage.removeChild(sprite);
    if (i % 2 == 0) {
      this.pool.returnWindow(sprite);
    } else {
      this.pool.returnDecoration(sprite);
    }
  }
  this.wallSlices = [];
}

