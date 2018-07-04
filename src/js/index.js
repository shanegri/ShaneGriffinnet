$(function() {
  App.init();
});


var App = {
  init: function() {
    Nav.init();
    ScrollController.init();
    ScrollController.addCallback(function(lowerBound) {
      if(lowerBound < 800 && !Nav.atHome) {
        // Nav.transitionHome();
      }
    });
  }
}