/* jshint devel:true */

$(function() {
  new Main();
});

function Main() {
  this.stage = new PIXI.Stage(0x000000);
  this.renderer = PIXI.autoDetectRenderer(Main.width, Main.height);

  document.getElementsByClassName('minesweeper')[0].appendChild(this.renderer.view);

  var assetsToLoad = [];
  this.loader = new PIXI.AssetLoader(Main.assetize(assetsToLoad));
  this.loader.onComplete = this.onAssetsLoaded.bind(this);
  this.loader.load();
}

Main.width = 512;
Main.height = 384;

Main.assetize = function(arr) {
  return arr.map(Main.assetPath);
}

Main.assetPath = function(file) {
  return 'assets/img/' + file;
}

Main.prototype.onAssetsLoaded = function() {
  requestAnimFrame(this.draw.bind(this));
}

Main.prototype.draw = function() {
  requestAnimFrame(this.draw.bind(this));
  this.renderer.render(this.stage);
}

