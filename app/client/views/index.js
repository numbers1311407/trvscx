module.exports = {
  Face: require("./face"),
  About: require("./about"),
  Nav: require("./nav"),
  Contact: require("./contact"),
  Resume: require("./resume"),
  Work: require("./work"),

  //
  // This is an unfortunate hack that works around the lazy loading
  // feature of the views and loads them all at once. It's necessary
  // because when loading the site on a small screen, views are scrolled
  // to and not explicitly shown.
  //
  // This could also be solved by scroll spying and init'ing when views
  // come on screen, but it seems like overkill.  The only nice thing
  // about scroll spying would be the ability to alter the URL on scroll
  // to match the current section.
  //
  init: function () {
    new this.About();
    new this.Contact();
    new this.Work();
    new this.Resume();
  }
}
