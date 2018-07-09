var ScrollController =  {
//Inform Each st object when to run 
//Maintain scroll handler
//Dispose of scroll handler when at home

init: function() {
    this.$window = $(window);
    this.bindHandlers();
    this.scrollCallbacks = {};
    this.scrollElems = [];
    $(".animate-on-left").each(function(i, obj) {
        this.scrollElems.push(new ScrollTransition($(obj), "left"));
    }.bind(this));
    $(".animate-on-right").each(function(i, obj) {
        this.scrollElems.push(new ScrollTransition($(obj), "right"));
    }.bind(this));
    this.resize({height: $(window).height()});
},
scroll: function() {
    if(!this.isScrolling) {
        this.isScrolling = true;
        setTimeout(function() {
            this.isScrolling = false
            var lowerBound = this.$window.scrollTop();
            var upperBound = lowerBound + this.height;
        
            for(i in this.scrollElems) this.scrollElems[i].checkScroll(lowerBound, upperBound);
        
            for(i in this.scrollCallbacks) this.scrollCallbacks[i](lowerBound, upperBound);
        }.bind(this), 200)
    }
},
resize: function(w) {
    this.height = w.height;
},
bindHandlers: function() {
    this.$window.bind("scroll", this.scroll.bind(this));
},
unbindHandlers: function() {
    this.$window.unbind('scroll');
},
registerScroll: function(key, callback){
    this.scrollCallbacks[key] = callback;
},
removeScroll: function(key) {
    if(this.scrollCallbacks[key])
        delete this.scrollCallbacks[key]
},
registerElemTransition: function(key, $elem, scroll_f, resize_f) {
    this.scrollCallbacks[key] = function(lowerBound, upperBound) {
        var top = $elem.position().top;
        var height = $elem.height();
        var animateBound = top + 100 > upperBound;
        var resetBound = top - 250 > upperBound;
        if(!animateBound) {
            scroll_f();
        } else if(resetBound) {
            resize_f();
        }
    }
},
removeElemTransition: function(key) {
    this.removeScroll(key);
}

};

var ScrollTransition = function($elem, leftOrRight) {
    this.translateAmt = leftOrRight == "left" ? -75 : 75;
    this.animating = false;
    this.active = true;
    this.$elem = $elem;
    this.top = $elem.position().top;
    this.height = $elem.height();
    this.checkScroll();
};
ScrollTransition.prototype.checkScroll = function(lowerBound, upperBound) {
    var outOfUpperBound = (this.top + this.height) < lowerBound;
    var animateBound = this.top + 100 > upperBound;
    var resetBound = this.top - 250 > upperBound;
    if(!animateBound) {
        this.animateOn();
    } else if(resetBound) {
        this.reset();
    }
};
ScrollTransition.prototype.reset = function() {
    this.active = false;
    this.$elem.css( { opacity: 0.0 })
};
ScrollTransition.prototype.animateOn = function() {
    if(this.animating || this.active) return;
    
    this.animating = true;
    this.$elem.delay(0).velocity("stop").velocity(
        {
            translateX: [0, this.translateAmt],
            opacity: 1.0
        },
        {
            easing: "ease",
            duration: 800,
            complete: function() {this.active = true; this.animating = false}.bind(this)
        }
    );
};
