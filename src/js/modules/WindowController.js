var WindowController = {
    resizeCallbacks:  {},
    init: function() {
        $(window).on('resize', this.resizeThrottle.bind(this));
    },
    registerResize: function(key, callback){
        this.resizeCallbacks[key] = callback;
    },
    removeResize: function(key) {
        if(this.resizeCallbacks)
        delete this.resizeCallbacks[key];
    },
    resize: function() {
      var width = $(window).width();
      var height = $(window).height();
      var size = {width: width, height: height};
      for(i in this.resizeCallbacks) {
          this.resizeCallbacks[i](size);
      }  
    },
    resizeThrottle: function() {
        if(!this.isResizing) {
            this.isResizing = true;
            setTimeout(function() {
                this.isResizing = false;
                this.resize();
            }.bind(this), 300);
        }
    }

}