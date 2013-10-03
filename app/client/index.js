var $ = require("jquery")
  , Backbone = require("backbone")
  , views = require("./views")

// Assign $ to Backbone
Backbone.$ = $;

// require non-commonjs plugins
require("bootstrap-transition");
require("tooltipster");

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
    this._showFace("#about");
  },

  resumeView: function () {
    views.Resume.enqueue();
  },

  workView: function () {
    views.Work.enqueue();
  },

  contactView: function () {
    views.Contact.enqueue();
  },

  _showFace: function(id) {
    views.Face.enqueue(id);
  }
})


$(function () {
  var router = new Router();

  $(document).on("click", "a[data-nav]", function (e) {
    e.preventDefault();
    router.navigate(this.getAttribute('href'), {trigger: true});
  })

  $(document).on("click", 'a[rel="external"]', function (e) {
    e.preventDefault();
    window.open(this.getAttribute('href'));
  })

  Backbone.history.start({
    // pushState: true
  });
});
