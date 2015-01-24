function ObjectPool() {
  this._pool = [];

  this.seed(ObjectPool.FIXTURES);
}

ObjectPool.FIXTURES = [
  {type: ObjectType.FRONT, args: ['edge_01'], quantity: 2},
  {type: ObjectType.FRONT, args: ['edge_02'], quantity: 2},
  {type: ObjectType.BACK, args: ['edge_01'], quantity: 2},
  {type: ObjectType.BACK, args: ['edge_02'], quantity: 2},
  {type: ObjectType.STEP_UP, args: ['step_01'], quantity: 2},
  {type: ObjectType.STEP_DOWN, args: ['step_01'], quantity: 2},
  {type: ObjectType.DECORATION, args: ['decoration_01'], quantity: 6},
  {type: ObjectType.DECORATION, args: ['decoration_02'], quantity: 6},
  {type: ObjectType.DECORATION, args: ['decoration_03'], quantity: 6},
  {type: ObjectType.WINDOW, args: ['window_01'], quantity: 6},
  {type: ObjectType.WINDOW, args: ['window_02'], quantity: 6},
  {type: ObjectType.PLATFORM, quantity: 5},
];

ObjectPool.prototype.seed = function(fixtures) {
  var len = fixtures.length;
  for (var i = 0; i < len; i++ ) {
    var fixture = fixtures[i];
    this.addType(fixture.type, fixture.args, fixture.quantity);
  }
}

ObjectPool.prototype.addType = function(type, args, n) {
  if (n == null) {
    n = 1
  }

  if (this._pool[type.id] == null) {
    this._pool[type.id] = [];
  }

  for (var i = 0; i < n; i++ ) {
    if (args == null) {
      args = [];
    }

    var obj = this.construct(type.construct, args);
    if (type.setup) {
      type.setup.call(obj);
    }

    obj.poolTypeId = type.id;


    this._pool[type.id].push(obj);
  }
}

ObjectPool.prototype.construct = function(klass) {
  return new (Function.prototype.bind.apply(klass, arguments));
}

ObjectPool.prototype.borrow = function(type) {
  if (type == null) {
    debugger;
  }
  if (this._pool[type.id] == null) {
    throw 'Cannot retrieve type ' + type.id + ' from missing pool';
  }

  if (this._pool[type.id].length == 0) {
    throw 'Cannot retrieve type ' + type.id + ' from empty pool';
  }

  var i = Math.floor(Math.random() * this._pool[type.id].length);
  return this._pool[type.id].splice(i, 1)[0];
}

ObjectPool.prototype.return = function(obj) {
  id = obj.poolTypeId;
  if (id == null) {
    throw 'Cannot return obj without poolTypeId';
  }

  if (this._pool[id] == null) {
    throw 'Cannot return into missing pool for type ' + id;
  }

  this._pool[id].push(obj);
}

