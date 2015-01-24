var Util = (function() {
  var public = {};

  public.clamp = function(x, min, max) {
    return Math.min(Math.max(x, min), max);
  }

  return public;
}());

