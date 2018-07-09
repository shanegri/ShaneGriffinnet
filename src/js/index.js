$(function() {

  App.init();

});


var App = {
  init: function() {
    WindowController.init();
    ScrollController.init();

    Photography.init(); 
    Nav.init();

    WindowController.registerResize("nav",Nav.resize.bind(Nav));
    WindowController.registerResize("photo",Photography.resize.bind(Photography));
    WindowController.registerResize("scroll",ScrollController.resize.bind(ScrollController));


  }
}