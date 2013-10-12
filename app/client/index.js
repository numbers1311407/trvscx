var $ = require("jquery")
  , Backbone = require("backbone")
  , views = require("./views")


if (!Modernizr.csstransforms3d) {
  $('html').removeClass("loading");
}


// Assign $ to Backbone
Backbone.$ = $;

// require non-commonjs plugins
require("bootstrap-transition");
require("tipsy");


var Router = Backbone.Router.extend({
  initialize: function () {
    this.$nav = new views.Nav({el: "nav"});
  },

  routes: {
    "": "aboutView",
    "resume": "resumeView",
    "work": "workView",
    "contact": "contactView"
  },

  aboutView: function () {
    views.About.enqueue();
  },

  resumeView: function () {
    views.Resume.enqueue();
  },

  workView: function () {
    views.Work.enqueue();
  },

  contactView: function () {
    views.Contact.enqueue();
  }

})


$.fn.onTransitionEnd = function(duration, cb) {
  var el = this.get(0)
    , called = false
    , buffer = 30

  $(this).on($.support.transition.end, function (e) { 
    if (e.target !== el) {
      return;
    }
    $(el).off($.support.transition.end);
    called = true;
    cb(e);
  });

  var callback = function () { 
    if (!called) { 
      $(el).trigger($.support.transition.end);
    }
  }

  setTimeout(callback, duration + buffer);
  return this
};


$(function () {
  var router = new Router();

  // init a copy of each of the views
  views.init();

  var lastSectionExpand = function () {
    var h = $(window).height()
      , sh = $("section:last-child").outerHeight(true);
    $("section:last-child").css("margin-bottom", h - sh);
  }
  $(window).on("resize.lastSectionExpand", lastSectionExpand);
  lastSectionExpand();

  $(document).on("click", "a[data-nav]", function (e) {
    e.preventDefault();
    var history = Backbone.history;
    var fragment = history.getFragment(this.getAttribute('href'));
    var same = fragment === history.fragment;

    router.navigate(fragment);

    // navigate to the same route in mobile, but not when in face
    // transition mode (chaos)
    if (!same || !views.Face.transitionOk()) {
      history.loadUrl(fragment);

      if ("undefined" !== typeof ga) {
        ga('send', 'pageview', fragment.replace(/^([^\/]|$)/, '/$1'));
      }
    }
  })

  $(document).on("click", 'a[rel="external"]', function (e) {
    e.preventDefault();
    window.open(this.getAttribute('href'));
  })


  Backbone.history.start({
    pushState: true,
    silent: true
  });
});

$(window).load(function () {
  Backbone.history.loadUrl();
});
