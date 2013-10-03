var config = require("../../config/cachify")
  , cachify = require("connect-cachify")

module.exports = function (isdev) {
  return cachify.setup(config.assets, {
    root: process.cwd() + "/public",
    url_to_paths: cachify.url_to_paths,
    production: !isdev
  })
}
