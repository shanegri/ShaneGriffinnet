var Nav = {
    init: function(){   
        this.atHome = true;
        this.cacheDOM();
        this.bindHandlers();  
        this.hashchange();
    },
    cacheDOM: function() {
        this.$nav = $("#nav-container");
        this.$content = $("#content-container");
    },
    bindHandlers: function() {
        this.$nav.find('.nav-link').on('click', this.transition.bind(this));
        $(window).on('hashchange', this.hashchange.bind(this));
    },

    gotoHome: function() {
        this.$nav.removeClass('nav-content-top');
        this.$nav.addClass('nav-content-center');

        this.$nav.removeClass('nav-top');
        this.$nav.addClass('nav-center');
    },
    gotoHeading: function() {
        this.$nav.removeClass('nav-content-center');
        this.$nav.addClass('nav-content-top');

        this.$nav.removeClass('nav-center');
        this.$nav.addClass('nav-top');

    },

    transitionHome: function(complete) {
        var duration = 900;

        this.$nav.removeClass('nav-content-top');
        this.$nav.addClass('nav-content-center');

        if(!this.atHome) {
            var offset = this.$nav.position();
            var size = {height: this.$nav.height(), width: this.$nav.width()}
    
            this.$nav.removeClass('nav-top');
    
            this.$nav.css({
                top: offset.top,
                left: offset.left,
                width: size.width,
                height: size.height,
            });

            this.$nav.velocity(
                {
                    top: $(window).height() * .25,
                    width: 300,
                    height: 375
                },
                {
                    easing: [.52,.12,0,1],
                    duration: duration,
                    complete: function() {
                        this.$nav.attr("style", "");
                        this.$nav.addClass('nav-center')
                        complete();
                    }.bind(this)
                }
            );
        }

        this.$content.velocity("scroll", {
            offset: -100,
            complete: function() {
                complete();
                this.$content.hide()
            }.bind(this),
            duration: 300
        });
    },
    transitionHeading: function(target, complete) {

        var duration = 900;

        this.$nav.removeClass('nav-content-center');
        this.$nav.addClass('nav-content-top');

        var offset = this.$nav.position();
        var size = {height: this.$nav.height(), width: this.$nav.width()}

        this.$nav.removeClass('nav-center');

        this.$nav.css({
            top: offset.top,
            left: offset.left,
            width: size.width,
            height: size.height,
        });

        this.$nav.velocity(
            {
                top: 10,
                width: $(window).width() - 20,
                height: 70
            },
            {
                easing: [.52,.12,0,1],
                duration: duration,
                complete: function() {
                    this.$nav.attr("style", "");
                    this.$nav.addClass('nav-top')
                    complete();
                }.bind(this)
            }
        );


        this.$content.show();
        $(target).velocity("scroll", {
            offset: -100,
            duration: 300
        });
    },
    transition: function(e) {
        var target = $(e.target).attr('href');
        window.history.pushState("", "", window.location.pathname + target)
        if(target == "#"){
            this.transitionHome(() => this.atHome = true);
        } else {
            this.transitionHeading(target, () => this.atHome = false);
        }
    },
    hashchange: function() {
        var hash = window.location.hash;
        if(hash == "#" || hash == "") {
            this.gotoHome()
        } else {
            this.gotoHeading();
        }
    }
}