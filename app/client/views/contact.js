var Backbone = require("backbone")
  , Face = require("./face")

module.exports = Face.extend({
  el: "#contact-face",

  // the form is submitted immediately, fake a "sending" timer for effect
  sendingTime: 700,

  events: {
    "blur input": "onInputBlur",
    "submit form": "onFormSubmit"
  },

  onFormSubmit: function (e) {
    e.preventDefault();
    $.ajax({
      url: "/contact",
      type: 'post',
      data: this.$("form").serialize()
    })
    this.showThanks();
  },

  showThanks: function () {
    var $el = $(".contact-form");

    $el.addClass("submitted");
    $el[0].offsetWidth;
    $el.addClass("sending");

    var cb = function () {
      $el.addClass("static");
    }

    setTimeout(function () {
      $el
        .removeClass("sending")
        .addClass("thanks")
      // could use transtionEnd here but would have to listen for
      // both events as sending will end first
      setTimeout(cb, 1000);
    }, this.sendingTime);
  },

  initialize: function (options) {
    Face.prototype.initialize.call(this, options);
    // this can't be bound in events, presumably because the event
    // cannot be given a chance to bubble to the form (events would
    // bind above it with delegation)
    this.$("input").bind("invalid", this.onInputInvalid.bind(this));
  },

  onHidden: function () {
    this.resetForm();
  },

  onInputBlur: function (e) {
    var empty = 0 === $(e.target).val().length;
    $(e.target).toggleClass("blurred", !empty);
  },

  onInputInvalid: function (e) {
    e.preventDefault();
    $(e.target).addClass("blurred");
  },

  resetForm: function () {
    this.$(".contact-form").removeClass("thanks sending submitted");
    this.$(".contact-form").removeClass("static");
    this.$("input, textarea").val("");
    this.$("input").removeClass("blurred");
  }
});
