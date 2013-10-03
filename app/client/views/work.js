var Backbone = require("backbone")
  , Face = require("./face")

module.exports = Face.extend({
  el: "#work-face",

  events: {
    "click li.site:not(.active)": "onSiteClick"
  },

  onSiteClick: function (e) {
    this.$("li.site.active").removeClass("active");
    return $(e.currentTarget).addClass("active");
  },

  onShown: function () {
    var $lis = $("li.site:not(.active)")
      , len = $lis.length

    var ftime = 90;

    ;(function flash (i) {
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
