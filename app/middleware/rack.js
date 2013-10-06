var rack = require("asset-rack")
  , browserify = require("browserify")
  , less = require("less")
  , _ = require("underscore")
  , fs = require("fs")
  , bconf = require("./browserify")
  , shim = require("browserify-shim")

var assets = []

var BrowserifyAsset = rack.Asset.extend({
  mimetype: "text/javascript",
  
  create: function (options) {
    var b = browserify();
    _.each(options.require, function (o) {
      b.require(o);
    })
    _.each(options.external, function (o) {
      b.external(o);
    })
    if (options.shims) {
      b = shim(b, options.shims);
    }
    if (options.entry) {
      b.require(options.entry, {entry: true});
    }

    b.bundle(function (err, src) {
      if (err) throw err;

      this.contents = (options.compress)
        ? require("uglify-js").minify(src, {fromString: true}).code
        : src;
      this.emit("created");
    }.bind(this))
  }
})


var LessAsset = rack.Asset.extend({
  mimetype: "text/css",

  create: function (options) {
    var optimization = undefined === options.optimization
      ? 1
      : options.optimization;

    var compress = undefined === options.compress ? true : options.compress;

    var callback = function (err, css) {
      if (err) throw err;
      this.contents = css;
      this.emit("created");
    }.bind(this);

    fs.readFile(options.filename, 'utf8', function (err, str) {
      if (err) return callback(err);

      var parser = new(less.Parser)({
        paths: options.paths,
        filename: options.filename,
        optimization: optimization
      })

      parser.parse(str, function (err, tree) {
        if (err) return callback(err);
        try {
          var css = tree.toCSS({ 
            compress: compress,
            rootpath: "/foo"
          })
          callback(null, css);
        } catch (parseError) {
          callback(parseError);
        }
      })
    })
  }
})

assets.push(new LessAsset({
  url: "/css/screen.css",
  paths: ["components"],
  compress: true,
  filename: __dirname + "/../less/screen.less"
}));

assets.push(new BrowserifyAsset({
  url: "/js/vendor.js",
  require: bconf.core,
  shims: bconf.shims,
  compress: true
}));

assets.push(new BrowserifyAsset({
  url: "/js/bundle.js",
  external: bconf.externals,
  entry: require.resolve("../client/index.js"),
  compress: true
}));

assets.push(new rack.StaticAssets({
  urlPrefix: "/js",
  dirname: __dirname + "/../../public/js"
}));


module.exports = new rack.Rack(assets);
