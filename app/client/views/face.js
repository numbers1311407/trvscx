var Backbone = require("backbone");

var minTransitionWidth = 965;

// transition at all? if no 3d transforms, no
var transition = function () {
  return !!Modernizr.csstransforms3d && $(window).width() > minTransitionWidth;
}

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

    if (!$hide) {
      $(".face").not(self.$el).each(function () {
        $(this).addClass("static "+getOppositeCorner(this.getAttribute("data-corner")));
      });
    }

    this.onShow();
    Backbone.trigger("show:face", self);

    var show = function () {
      if ($hide) $hide.hide(self);
      return $el
        .addClass('current')
        .removeClass('bottomRight topRight bottomLeft topLeft static');
    }

    if (transition()) {
      process.nextTick(function () {
        show()
          .one($.support.transition.end, onshow)
          .emulateTransitionEnd(transitionDuration + 50)
      })
    } 
    else {
      show();
      var eltop = this.$el.offset().top
        , shown = $("html").hasClass("faceshown")
        , duration = shown ? 400 : 0

      $("html,body").animate({scrollTop: eltop}, {
        duration: duration,
        easing: 'swing',
        done: function () {
          $("html").addClass("faceshown");
        }
      });
      onshow();
    }

    return dfr.promise();
  },

  hide: function ($show) {
    var hideCorner = $show.corner
      , resetCorner = getOppositeCorner(this.corner)
      , self = this

    var onhide = function () {
      self.$el.removeClass(hideCorner).addClass(resetCorner+" static");
      self.onHidden();
    }

    var hide = function () {
      return self.$el
        .removeClass('current topLeftHover topRightHover bottomLeftHover bottomRightHover down')
        .addClass(hideCorner)
    }

    this.onHide();
    Backbone.trigger("hide:face", this);

    if (transition()) {
      hide()
        .one($.support.transition.end, onhide)
        .emulateTransitionEnd(transitionDuration + 50)
    }
    else {
      hide()
      onhide();
    }
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
