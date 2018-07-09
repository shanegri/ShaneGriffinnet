var Photography = {
    init: function() {
        this.$container = $("#gallery-container");
        this.$gallery = this.$container.find("#gallery");
        this.$galleryPadding = this.$container.find("#gallery-padding");
        this.photo_objs = [];
        
        this.size = 200;
        this.padding = 400;
        this.rows = 2

        $.ajax({
           url: "http://localhost/src/server/get-images.php",
           dataType: "json",
           success: ajaxSuccess.bind(this)
        });

        function ajaxSuccess(response) {
            if(response.status == "good"){
                var images = response['images'];
                for(i in images){
                    var img_url = "http://localhost/src/images/thumb/" + images[i];
                    this.photo_objs.push(new Photo(this.$gallery, img_url));
                }

                ScrollBar.init();
           
                this.setGrid({
                    size: 200,
                    padding: 400,
                    rows: 2
                });
                
                ScrollController.registerElemTransition(
                    "photoScroll", 
                    this.$container, 
                    this.transitionOn.bind(this), 
                    function() {}
                );
            }
        }

    },
    //'Recursively' calls load on each photo object
    transitionOn: function() {
        if(this.isActive) return;
        this.isActive = true;

        ScrollController.removeElemTransition("photoScroll");
        function loadImages(i) {
            if(i >= this.photo_objs.length) { 
                ScrollController.registerElemTransition(
                    "photoScroll",
                    this.$container, 
                    this.transitionOn.bind(this), 
                    this.transitionReset.bind(this)
                )
                return;  
            }
            setTimeout(function() {
                this.photo_objs[i].initLoad(i + 1, loadImages.bind(this));
            }.bind(this), 100)
        }
        loadImages.bind(this)(0);
    },
    
    transitionReset: function() {
        this.isActive = false;
        for(i in this.photo_objs) this.photo_objs[i].resetTransition();
    },

    setScroll: function(precentage){
        var newScroll = this.maxScroll * precentage;
        this.$container.scrollLeft(newScroll);
    },
    setGrid: function(settings){
        if(settings){
            this.size = assign(settings.size, this.size);
            this.padding = assign(settings.padding, this.padding);
            this.rows = assign(settings.rows, this.rows);
        }
        for(i in this.photo_objs){
            this.photo_objs[i].setSize({width: this.size, height: this.size});
        }
        this.width = (this.size / 2) + Math.ceil(this.photo_objs.length / this.rows) * this.size;
        this.height = this.size * this.rows;
        
        this.$gallery.css({width: this.width + "px", height: this.height});
        this.$galleryPadding.css({width: this.width + this.padding + "px"});

        this.resize({width: $(window).width()});
        ScrollBar.setBar((this.padding / 2) / this.maxScroll);
    },

    resize: function(w) {
        this.maxScroll = Math.max(this.$galleryPadding.width() - w.width, 0);
        ScrollBar.resize(w);
    }
}

var Photo = function($photos, url) {
    this.isLoaded = false;
    this.url = url;
    this.$img = $("<img draggable='false'></img>");
    this.$img.css({opacity: 0})
    $photos.append(this.$img);
}
Photo.prototype.setSize = function(size) {
    this.$img.css(size);
}
Photo.prototype.registerHandlers = function() {
    this.$img.on('mouseover', this.mouseover.bind(this));
    this.$img.on('mouseleave', this.mouseleave.bind(this));
}
Photo.prototype.initLoad = function(i, complete_f) {
    if(this.isLoaded) {
        this.transitionOn(i, complete_f); 
    } else {
        this.$img.on('load', function() { 
            this.isLoaded = true;
            this.$img.off('load');
            this.transitionOn.bind(this)(); 
            complete_f(i);
        }.bind(this));
        this.$img.attr('src', this.url);
    }
}
Photo.prototype.mouseover = function() {
    this.$img.velocity("stop").velocity(
        {
            scale: 1.1,
            marginLeft: 30,
            marginRight: 30
        })
}
Photo.prototype.mouseleave = function() {
    this.$img.velocity("stop").velocity(
        {
            scale: 1.0,
            marginLeft: 0,
            marginRight: 0
        })
}
Photo.prototype.transitionOn = function(i, complete_f) {
    if(i || complete_f) complete_f(i);

    this.$img.velocity("stop").velocity(
        {
            opacity: 1.0,
            scale: [1.0, 0.9]
        },
        {
            complete: this.registerHandlers.bind(this)
        })
}
Photo.prototype.resetTransition = function() {
    this.$img.velocity("stop");
    this.$img.css({opacity: 0});
    this.$img.off("mouseover");
    this.$img.off("mouseleave");
}


var ScrollBar = {
    init: function() {
        this.$barContainer = $("#gallery-scroll-container");
        this.$bar = this.$barContainer.find('#gallery-scroll-bar')
        this.marginLeft = 0;

        this.$bar.on('mousedown', this.mousedown.bind(this));
    },
    mousedown: function(e){
        e.preventDefault();
        $(window).bind('mousemove', this.mousemove.bind(this));
        $(window).bind('mouseup', this.mouseup.bind(this));
        this.barOffset = e.clientX - this.offset - this.marginLeft;
    },
    mousemove: function(e) {
        if(!this.isScrolling){
            this.isScrolling = true;
            
            setTimeout(function() {
                this.isScrolling = false;
                this.marginLeft = e.clientX - this.offset - this.barOffset;
                this.updateBar();
            }.bind(this), 10)
        }
    },
    mouseup: function() {
        $(window).unbind('mousemove');
        $(window).unbind('mouseup');
    },
    updateBar: function() {
        if(this.marginLeft < 0) this.marginLeft = 0;
        if(this.marginLeft > this.maxScroll) this.marginLeft = this.maxScroll;
        this.$bar.css({"margin-left": this.marginLeft});
        Photography.setScroll(this.marginLeft / this.maxScroll);
    },
    resize: function(w) {
        this.barConWidth = this.$barContainer.width();
        this.barWidth = this.$bar.width();
        this.offset = Math.floor((w.width - this.barConWidth) / 2)
        this.maxScroll = this.barConWidth - this.barWidth;
        this.updateBar();
    },
    setBar: function(precent) {
        this.marginLeft = this.maxScroll * precent;
        this.updateBar();
    }
}