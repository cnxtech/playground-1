var Random = (function() {
  var public = {};

  public.generate = Math.random;

  public.boxMullerTransform = function(mu, sigma) {
    if (arguments.length <= 1) sigma = 1;
    if (arguments.length === 0) mu = 0;
    var u = 0,
        v = 0,
        s;

    do {
      u = this.generate() * 2 - 1;
      v = this.generate() * 2 - 1;
      s = u * u + v * v;
    } while (s === 0 || s > 1);

    var c = Math.sqrt(-2 * Math.log(s)/s),
        x = u * c;

    x = mu + x * sigma;
    return x;
  };

  return public;
}());

