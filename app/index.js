/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path')
  , qs = require('qs')
  , pkg = require("../package.json")
  , util = require("util")

var app = module.exports = express()

var isdev = 'production' !== process.env.NODE_ENV

// Set the CDN options
var options = {
    publicDir  : path.join(__dirname, '../public')
  , viewsDir   : path.join(__dirname, 'views')
  , domain     : 'cdn.trvscx.com'
  , bucket     : 'cdn.trvscx'
  , endpoint   : 'cdn.trvscx.s3.amazonaws.com' // optional
  , key        : process.env.AWS_KEY
  , secret     : process.env.AWS_SECRET
  , hostname   : 'localhost'
  , port       : process.env.PORT || 3000
  , ssl        : false
  , production : !isdev
};

// Hack to allow express-cdn to upload to AWS unsecurely.  This, I
// believe, is a bug because the bucket name has a dot in it.  It
// is apparently fixed in later versions of knox which express-cdn is
// not using yet.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// Initialize the CDN magic
var CDN = require('express-cdn')(app, options);

app.locals({ CDN: CDN() });

app.configure(function () {
  app.set('port', process.env.PORT || 3000)
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')

  app.use(express.favicon(__dirname + '/../public/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.compress());

  app.locals.pretty = isdev;

  // app.use(require("./middleware/cachify")(isdev));

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
  app.use(app.router)
})


app.set('author', pkg.author.name);
app.set('email', pkg.author.email);

app.configure('development', function () {
  app.use(express.errorHandler())
})

var mailer = require("nodemailer");
var transport = mailer.createTransport("SMTP", {
  host: "email-smtp.us-east-1.amazonaws.com",
  port: 465,
  secureConnection: true,
  auth: {
    user: process.env.SES_SMTP_USERNAME,
    pass: process.env.SES_SMTP_PASSWORD
  }
});

app.post("/contact", function (req, res) {
  res.send(200);

  var options = {
    from: pkg.author.email,
    to: pkg.author.email,
    subject: util.format("Contact from: %s <%s>", req.body.name, req.body.email),
    text: util.format("%s\n%s\n\n%s", req.body.name, req.body.email, req.body.message)
  }

  process.nextTick(function () {
    transport.sendMail(options, function (err, status) {
      console.log(arguments);
    })
  })
})

app.get(/^\/(work|contact|resume)?$/, function (req, res) {
  res.render("index", {title: pkg.name});
});
