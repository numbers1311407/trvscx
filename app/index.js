/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path')
  , qs = require('qs')
  , pkg = require("../package.json")

var app = module.exports = express()

var isdev = 'production' !== process.env.NODE_ENV

app.configure(function () {
  app.set('port', process.env.PORT || 3000)
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.use(express.favicon(__dirname + '/../public/favicon.ico'));
  app.use(express.logger('dev'))

  app.locals.pretty = true //isdev;

  app.use(require("./middleware/cachify")(isdev));

  if (isdev) {
    app.use(require("less-middleware")({
      paths: ["components"],
      src: __dirname + '/less',
      dest: __dirname + "/../public/css",
      debug: true,
      prefix: "/css"
    }))

    var browserify = require("./middleware/browserify");
    app.use("/js/vendor.js", browserify.vendor);
    app.use("/js/bundle.js", browserify.bundle);
  }

  var crypto = require("crypto")
    , hash = crypto.createHash("md5")
      .update(pkg.author.email.toLowerCase().trim())
      .digest("hex")
  app.use(function (req, res, next) {
    res.locals.gravatar = function (options) {
      var url = req.protocol+"://gravatar.com/avatar/"+hash;
      if (options) url += "?" + qs.stringify(options);
      return url;
    }
    next();
  })

  app.use(express.static(path.join(__dirname, '../public')))
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(app.router)
})


app.set('author', pkg.author.name);
app.set('email', pkg.author.email);


app.configure('development', function () {
  app.use(express.errorHandler())
})


app.get(/^\/(work|contact|resume)?$/, function (req, res) {
  res.render("index", {title: pkg.name});
});
