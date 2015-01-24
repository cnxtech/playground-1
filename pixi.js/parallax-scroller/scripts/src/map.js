function Map() {
  PIXI.DisplayObjectContainer.call(this);

  this.viewPortX = 0;
  this.deltaX = 0;

  this.createPlatforms();
};

Map.constructor = Map;

Map.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

Map.spawn = {
  x: 60,
  y: 180
}

Map.distribution = {
  x: {
    mean: 96,
    sd: 15
  },
  y: {
    mean: 160,
    sd: 30
  }
}

Map.prototype.createPlatforms = function() {
  var start = this.createPlatform(Map.spawn.x, Map.spawn.y);
  start.hasNextPlatform = true;
  this.createNextPlatform();
  this.createNextPlatform();
  this.createNextPlatform();
}

Map.prototype.createPlatform = function(x, y) {
  var platform = main.pool.borrow(ObjectType.PLATFORM);
  platform.position.x = x;
  platform.position.y = y;
  platform.generate();
  platform.draw();
  this.addChild(platform);

  return platform;
}

Map.prototype.createNextPlatform = function() {
  var platform = this.children[this.children.length - 1],
    distance,
    x,
    y;

  distance = Random.boxMullerTransform(Map.distribution.x.mean, Map.distribution.x.sd);
  distance = Util.clamp(distance, 64, 128);

  x = platform.position.x + platform.totalWidth + distance;
  y = Random.boxMullerTransform(Map.distribution.y.mean, Map.distribution.y.sd);
  y = Util.clamp(y, Main.height - 256, Main.height - 64);

  this.createPlatform(x, y);
}

Map.prototype.setViewPortX = function(x) {
  var units, distance, platform;

  if (x < this.viewPortX) {
    x += Main.width;
  }
  units = x - this.viewPortX;
  this.viewPortX = x % Main.width;

  distance = (units * this.deltaX);

  release_queue = [];
  for (var i = 0; i < this.children.length; i++) {
    platform = this.children[i];
    platform.position.x -= distance;
    if (platform.update()) {
      release_queue.push(platform);
    }
  }

  for (var i = 0; i < release_queue.length; i++) {
    this.returnPlatform(release_queue[i]);
    this.createNextPlatform();
  }
}

Map.prototype.returnPlatform = function(platform) {
  this.removeChild(platform);
  main.pool.return(platform);
}

