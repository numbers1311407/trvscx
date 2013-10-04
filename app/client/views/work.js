var Backbone = require("backbone")
  , Face = require("./face")

module.exports = Face.extend({
  el: "#work-face",

  events: {
    "click li.site:not(.active)": "onClickSite"
  },

  onClickSite: function (e) {
    this.$("li.site.active").removeClass("active");
    return $(e.currentTarget).addClass("active");
  },

  onShown: function () {
    var $lis = $("li.site:not(.active)")
      , len = $lis.length
      , $el = this.$el

    var ftime = 90;

    // On shown, iterate over the unshown sites and light
    // them up by applying the flash class, to draw attention to them.  
    // If at any point during this the face is no longer current, stop 
    // the loop and clear the flash class.
    ;(function flash (i) {
      if (!$el.hasClass("current")) {
        $lis.removeClass("flash");
        return;
      }
      if (i > 0) {
        setTimeout(function () {
          $lis.eq(i-1).removeClass("flash");
        }, ftime / 2);
      }
      if (i >= len) return;
      $lis.eq(i).addClass("flash");
      setTimeout(function () { flash(i+1) }, ftime);
    }(0));
  }
});
