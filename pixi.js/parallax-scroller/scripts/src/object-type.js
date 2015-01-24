var ObjectType = Object.freeze({
  FRONT: {
    id: 0,
    construct: PIXI.Sprite.fromFrame
  },
  BACK: {
    id: 1,
    construct: PIXI.Sprite.fromFrame,
    setup: function() {
      this.anchor.x = 1;
      this.scale.x = -1;
    }
  },
  STEP_UP: {
    id: 2,
    construct: PIXI.Sprite.fromFrame,
    setup: function(obj) {
      this.anchor.x = 1;
      this.scale.x = -1;
      this.anchor.y = 0.25;
    }
  },
  STEP_DOWN: {
    id: 3,
    construct: PIXI.Sprite.fromFrame,
    setup: function(obj) {
      this.anchor.y = 0.25;
    }
  },
  DECORATION: {
    id: 4,
    construct: PIXI.Sprite.fromFrame
  },
  WINDOW: {
    id: 5,
    construct: PIXI.Sprite.fromFrame
  },
  PLATFORM: {
    id: 6,
    construct: Platform
  }
});

