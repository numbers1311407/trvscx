var Backbone = require("backbone");

// transition duration, must match the CSS
var transitionDuration = 1000;

var Face = module.exports = Backbone.View.extend({
  initialize: function (options) {
    this.corner = this.$el.data("corner");
  },

  show: function ($hide) {
    var $el = this.$el
      , self = this
      , dfr = $.Deferred()

    var onshow = function () {
      $el.addClass("down");
      self.onShown();
      dfr.resolve();
    }

    // FIXME change thing so this never needs to happen.  The page should
    // always init with a visibile page.
    if (!$hide) {
      $(".face").not(self.$el).each(function () {
        $(this).addClass("static "+getOppositeCorner(this.getAttribute("data-corner")));
      });
    }
    this.onShow();
    Backbone.trigger("show:face", self);

    process.nextTick(function () {
      if ($hide) $hide.hide(self);
      $el
        .addClass('current')
        .removeClass('bottomRight topRight bottomLeft topLeft static')
        .one($.support.transition.end, onshow)
        .emulateTransitionEnd(transitionDuration + 50)
    })

    return dfr.promise();
  },

  hide: function ($show) {
    var hideCorner = $show.corner
      , resetCorner = getOppositeCorner(this.corner)

    var onhide = function () {
      this.$el.removeClass(hideCorner).addClass(resetCorner+" static");
      this.onHidden();
    }.bind(this)

    this.onHide();
    Backbone.trigger("hide:face", this);

    this.$el
      .removeClass('current topLeftHover topRightHover bottomLeftHover bottomRightHover down')
      .addClass(hideCorner)
      .one($.support.transition.end, onhide)
      .emulateTransitionEnd(transitionDuration + 50)
  },

  onShow: function () {},

  onHide: function () {},

  onShown: function () {},

  onHidden: function () {}
}, {

  _q: $({}),

  enqueue: function (id) {
    var args = {};
    var view;
    if (this.instance) {
      view = this.instance;
    } else {
      if (id) args.el = id + "-face";
      view = new this(args);
    }
    this._q.queue(function (next) {
      view.show(Face.current)
        .done(function () {
          Face.current = view;
          next();
        })
    }.bind(this));
  }
});


function getOppositeCorner(corner) {
  return ("topLeft" === corner)
    ? "bottomRight"
    : ("topRight" === corner)
    ? "bottomLeft"
    : ("bottomLeft" === corner)
    ? "topRight"
    : "topLeft"
}
