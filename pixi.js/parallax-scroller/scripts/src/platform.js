function Platform() {
  PIXI.DisplayObjectContainer.call(this);

  this.totalWidth = 0;
  this.slices = this.createSlices();
};

Platform.prototype.poolTypeId = -1;

Platform.constructor = Platform;

Platform.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);

Platform.distribution = {
  mean: 7.5,
  sd: 4
}

Platform.MAX_SLICE_SIZE = 16;

Platform.prototype.createSlices = function() {
  var slices = [];
  slices.push(new PlatformSlice(0, ObjectType.FRONT));
  for(var i = 1; i < Platform.MAX_SLICE_SIZE; i++) {
    slices.push(new PlatformSlice(i));
  }
  return slices;
}

Platform.prototype.updateWidth = function() {
  this.totalWidth = (this.findTail().index + 1) * PlatformSlice.WIDTH;
}

Platform.prototype.findHead = function() {
  return this.slices[0];
}

Platform.prototype.findTail = function() {
  var tail,
    i = 0,
    len = this.slices.length;

  do {
    tail = this.slices[i++];
  } while (i < len && this.slices[i].type)

  return tail;
}

Platform.prototype.findFirstInViewPort = function() {
  var head,
    i = 0,
    len = this.slices.length;

  do {
    head = this.slices[i++];
  } while (head.type && head.sprite == null && i < len);
  return head;
}

Platform.prototype.draw = function() {
  var head = this.findHead();
  this.drawNextSlices(head);
};

Platform.prototype.drawSlice = function(slice) {
  var sprite = main.pool.borrow(slice.type);
  sprite.position.x = this.slices.indexOf(slice) * PlatformSlice.WIDTH;
  slice.sprite = sprite;
  this.addChild(sprite);
}

Platform.prototype.eraseSlice = function(slice) {
  this.removeChild(slice.sprite);
  main.pool.return(slice.sprite);
  slice.sprite = null;
}

Platform.prototype.drawNextSlices = function(next) {
  var worldX;

  do {
    worldX = (next.index * PlatformSlice.WIDTH) + this.position.x;
    if (worldX + PlatformSlice.WIDTH < 0 || worldX >= Main.width) {
      break;
    }

    if (next.sprite == null) {
      this.drawSlice(next);
    }

    if (next.index + 1 == this.slices.length) {
      break;
    }
    next = this.slices[next.index + 1];
  } while (next.type)
}

Platform.prototype.eraseNextSlices = function(next) {
  var worldX;

  do {
    worldX = (next.index * PlatformSlice.WIDTH) + this.position.x + PlatformSlice.WIDTH;
    if (worldX >= 0) {
      break;
    }

    this.eraseSlice(next);
    if (next.index + 1 == this.slices.length) {
      return next;
    }
    next = this.slices[next.index + 1];
  } while (next.type)

  return next;
}

Platform.prototype.update = function() {
  var next = this.findFirstInViewPort();

  if (next.sprite == null) {
    next = this.slices[0];
    this.drawNextSlices(next);
    return false; // has yet to enter viewport
  }

  next = this.eraseNextSlices(next); 
  if (next.sprite == null) {
    return true; // platform should be returned to pool
  }

  this.drawNextSlices(next);
  return false;
}

Platform.prototype.generate = function() {
  this.slices[0].type = ObjectType.FRONT;

  var len = Math.floor(Random.boxMullerTransform(Platform.distribution.mean, Platform.distribution.sd));
  len = Util.clamp(len, 1, Platform.MAX_SLICE_SIZE - 2);
  
  this.fill(len);

  this.slices[len + 1].type = ObjectType.BACK;
  if ((len + 2) < Platform.MAX_SLICE_SIZE) {
    this.slices[len + 2].type = null;
  }

  this.updateWidth();
};

Platform.prototype.fill = function(n) {
  var odd, even;
  if (Math.floor(Math.random() * 2) == 0) {
    odd = ObjectType.WINDOW;
    even = ObjectType.DECORATION;
  } else {
    odd = ObjectType.DECORATION;
    even = ObjectType.WINDOW;
  }

  for (var i = 1; i <= n; i++) {
    if (i % 2 == 0) {
      this.slices[i].type = even;
    } else {
      this.slices[i].type = odd;
    }
  }
};

Platform.prototype.clean = function() {
  var slice;
  for (var i = 0; i < this.slices.length; i++) {
    slice = this.slices[i];
    if (slice.type) {
      slice.type = null;
    }
  }
}

