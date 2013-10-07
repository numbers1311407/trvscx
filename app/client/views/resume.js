var Backbone = require("backbone")
  , Face = require("./face")

module.exports = Face.extend({
  el: "#resume-face",

  events: {
    "mouseenter .bar": "onMouseEnter",
    "mouseleave .bar": "onMouseLeave"
  },

  initialize: function (options) {
    Face.prototype.initialize.call(this, options);

    this.$('.tooltip').tipsy({
      gravity: $.fn.tipsy.autoNS,
      title: function () { 
        // return this.getAttribute('original-title').toUpperCase(); 
        return $(".details", this).html();
      } 
    })
  },

  onMouseEnter: function (e) {
    $(e.target).addClass("bar-active");
  },

  onMouseLeave: function (e) {
    $(e.target).removeClass("bar-active");
  }
});
