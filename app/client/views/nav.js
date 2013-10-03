var Backbone = require("backbone");

module.exports = Backbone.View.extend({
  cardClasses: "topLeftHover bottomLeftHover topRightHover bottomRightHover",

  initialize: function () {
    this.listenTo(Backbone, "show:face", this.onFaceShown);
    this.$card = $("#card");
  },

  events: {
    "mouseenter a": "onMouseEnter",
    "mouseleave a": "onMouseLeave",
    "click a": "onClick"
  },

  onMouseEnter: function (e) {
    var $li = $(e.currentTarget).parent();
    if ($li.hasClass("current")) return;
		var cornerClass = $li.attr('class') + "Hover";
    this.clearCardClass().addClass(cornerClass);
  },

  onMouseLeave: function (e) {
    this.clearCardClass();
  },

  onClick: function (e) {
    this.clearCardClass();
  },

  clearCardClass: function () {
    return this.$card.removeClass(this.cardClasses);
  },

  onFaceShown: function (face) {
    this.$("li.current").removeClass("current");
    this.$("li."+face.corner).addClass("current");
  }
})
