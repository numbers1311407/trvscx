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

      var eltop = this.$el.position().top
        , shown = !$("html").hasClass("loading")

      // if past loading, animate.  This will happen every time beyond
      // the first load (meaning the loading behavior could be refactored 
      // into a one time function)
      if (shown) {
        // because of the html+body animate hack (which may not be
        // necessary) wrap the callback so it only happens once.
        var called = false, deferredshow = function () {
          if (called) return;
          called = true;
          $("html").removeClass("loading");
          onshow();
        }
        $("html,body").animate({scrollTop: eltop}, {
          duration: 500,
          easing: 'swing',
          done: deferredshow
        });
      } 

      // Otherwise just remove loading and manually set the scrollTop.
      // Note that this has to be nextTicked for reasons known only to
      // the browser, or scrollTop will have no apparent effect.  It no
      // doubt has to do with how browsers retain scroll pos on refresh.
      else {
        process.nextTick(function () {
          $("html").removeClass("loading");
          $(window).scrollTop(eltop);
          onshow();
        })
      }
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
