var Backbone = require("backbone")
  , Face = require("./face")

module.exports = Face.extend({
  el: "#resume-face",

  options: {
    tooltipWidth: 300,
    tooltipTheme: "progress-bar-tooltip"
  },

  events: {
    "mouseenter .bar": "onMouseEnter",
    "mouseleave .bar": "onMouseLeave"
  },

  initialize: function (options) {
    Face.prototype.initialize.call(this, options);

    this.$('.tooltip').tooltipster({
      maxWidth: this.options.tooltipWidth,
      theme: this.options.tooltipTheme
      //functionAfter: this.onTooltipClose
    });
  },

  onMouseEnter: function (e) {
    var $bar = $(e.target);
    var html = $bar.find(".details").html();
    $bar.addClass("bar-active").tooltipster("update", html);
  },

  onMouseLeave: function (e) {
    $(e.target).removeClass("bar-active");
  }

  // This works but doesn't look great as the progress bar doesn't fade
  // out, making it look like the effect is lagged, not delayed.
  // TODO animate out progress bar animation
  // onTooltipClose: function (tip) {
  //   $(tip.context).removeClass("bar-active");
  // }
});
