var ScrollController =  {
//Inform Each st object when to run 
//Maintain scroll handler
//Dispose of scroll handler when at home

init: function() {
    this.$window = $(window);
    this.bindHandlers();
    this.scrollCallbacks = [];
    this.scrollElems = [];
    $(".animate-on").each(function(i, obj) {
        this.scrollElems.push(new ScrollTransition($(obj)));
    }.bind(this));
    this.resize();
},
scroll: function() {

    var lowerBound = this.$window.scrollTop();
    var upperBound = lowerBound + this.height;

    for(i in this.scrollElems) this.scrollElems[i].checkScroll(lowerBound, upperBound);

    for(i in this.scrollCallbacks) this.scrollCallbacks[i](lowerBound);

},
resize: function() {
    this.height = this.$window.height();
},
bindHandlers: function() {
    this.$window.bind("scroll", this.scroll.bind(this));
    this.$window.bind("resize", this.resize.bind(this));
},
unbindHandlers: function() {
    this.$window.unbind('scroll');
    this.$window.unbind('resize');
},
addCallback: function(callback){
    this.scrollCallbacks.push(callback);
}

};

var ScrollTransition = function($elem) {
    this.animating = false;
    this.$elem = $elem;
    this.top = $elem.position().top;
    this.height = $elem.height();
    this.checkScroll();
};
ScrollTransition.prototype.checkScroll = function(lowerBound, upperBound) {
    var outOfUpperBound = (this.top + this.height) < lowerBound;
    var outOfLowerBOund = this.top > upperBound;
    if(outOfLowerBOund) {
        this.reset();
    } else {
        this.animateOn();
    }
};

ScrollTransition.prototype.reset = function() {
    this.$elem.css(
        {
            opacity: 0.0
        })
};
ScrollTransition.prototype.animateOn = function() {
    if(this.animating) return;
    this.animating = true;
    this.$elem.delay(100).velocity("stop").velocity(
        {
            opacity: 1.0
        },
        {
            easing: "easeOut",
            duration: 600,
            complete: function() {this.animating = false}.bind(this)
        }
    );
};