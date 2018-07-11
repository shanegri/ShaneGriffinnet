$(function() {

  App.init();

});


var App = {
  init: function() {

    if(window.location.host.includes("127.0.0.1:5500")) {
      this.host = "http://localhost/src/";
    } else {
      this.host = "http://shanegriffin.net/";
    }

    WindowController.init();
    ScrollController.init();

    Photography.init(); 
    Nav.init();
    
    $(".video").each(function(i, obj) {
      video_obj = new Video($(obj));
      WindowController.registerResize("video", video_obj.resize.bind(video_obj));
    })

    WindowController.registerResize("nav",Nav.resize.bind(Nav));
    WindowController.registerResize("photo",Photography.resize.bind(Photography));
    WindowController.registerResize("scroll",ScrollController.resize.bind(ScrollController));


  }
}