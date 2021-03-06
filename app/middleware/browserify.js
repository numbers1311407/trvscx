var browserify = require("browserify")
  , shim = require("browserify-shim")


exports.core = [
  "backbone",
  "underscore"
]

exports.shims = {
  jquery: {
    path: require.resolve("../../components/jquery/jquery"),
    exports: 'jQuery'
  },

  "bootstrap-transition": {
    path: require.resolve("../../components/bootstrap/js/transition"),
    exports: null,
    depends: {jquery: "jQuery"}
  },

  "tipsy": {
    path: require.resolve("../../components/tipsy/src/javascripts/jquery.tipsy"),
    exports: null,
    depends: {jquery: "jQuery"}
  }
}


exports.externals = exports.core.concat(Object.keys(exports.shims));


var vendor;
exports.vendor = function (req, res, next) {
  // if (vendor) return res.send(vendor);
  var b = browserify();
  exports.core.forEach(function (module) {
    b.require(module);
  })
  b = shim(b, exports.shims);
  b.bundle(function (err, src) {
    if (err) throw err;
    vendor = src;
    res.setHeader("Content-Type", "text/javascript");
    res.send(src);
  })
}

var bundle;
exports.bundle = function (req, res, next) {
  // if (bundle) return res.send(bundle); 

  var b = browserify();
  exports.externals.forEach(function (shim) {
    b.external(shim);
  });
  b.require(require.resolve('../client/index.js'), { entry: true })
  b.bundle(function (err, src) {
    if (err) throw err;
    bundle = src;
    res.setHeader("Content-Type", "text/javascript");
    res.send(bundle);
  })
}
