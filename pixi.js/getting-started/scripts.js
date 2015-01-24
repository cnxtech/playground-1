function Main() {
  this.stage = new PIXI.Stage(0x66FF99);
  this.renderer = PIXI.autoDetectRenderer(400, 300);

  this.rotation = 0.1

  document.getElementsByClassName('container')[0].appendChild(this.renderer.view);

  var assetsToLoad = [Main.BUNNY_FILE];
  this.loader = new PIXI.AssetLoader(assetsToLoad);
  this.loader.onComplete = this.onAssetsLoaded.bind(this);
  this.loader.load();
}

Main.BUNNY_FILE = 'bunny.png';

Main.prototype.onAssetsLoaded = function() {
  var texture = PIXI.Texture.fromImage(Main.BUNNY_FILE);
  this.bunny = new PIXI.Sprite(texture);

  this.bunny.anchor.x = 0.5;
  this.bunny.anchor.y = 0.5;

  this.bunny.position.x = this.renderer.width / 2;
  this.bunny.position.y = this.renderer.height / 2;

  this.stage.addChild(this.bunny);

  this.initGUI();

  requestAnimFrame(this.update.bind(this));
}

Main.prototype.update = function() {
  requestAnimFrame(this.update.bind(this));
  this.bunny.rotation += this.rotation;
  this.renderer.render(this.stage);
}

Main.prototype.initGUI = function() {
  var gui = new dat.GUI();

  gui.add(this, 'rotation', -2, 2);
}

