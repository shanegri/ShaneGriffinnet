var Nav = {
    init: function(){
        this.navTopHeight = 70;
        this.currentHash = window.location.hash;    
        this.atHome = this.currentHash == "#" || this.currentHash == "";
        this.cacheDOM();
        this.resize({width: $(window).width()})
        this.bindHandlers();  
        this.hashchange();
    },
    cacheDOM: function() {
        this.$nav = $("#nav-container");
        this.$contentCon = $("#content-container");
        this.$content = this.$contentCon.find("#content");
    },
    bindHandlers: function() {
        this.$nav.find('.nav-link').on('click', this.transition.bind(this));
        $(window).on('hashchange', this.hashchange.bind(this));
    },
    resize: function(w) {
        if(w.width > 700) {
            this.navTopHeight = 70;
        } else {
            this.navTopHeight = 110;
        }
        if(!this.atHome){
            this.$nav.css({"height": this.navTopHeight + "px"});
        }
    },

    gotoHome: function() {

        this._removeScrollHandler();

        this.atHome = true;

        this.$nav.removeClass('nav-content-top');
        this.$nav.addClass('nav-content-center');

        this.$nav.removeClass('nav-top');
        this.$nav.addClass('nav-center');
    },
    gotoHeading: function() {

        this._registerScrollHandler();

        this.atHome = false;

        this.$nav.removeClass('nav-content-center');
        this.$nav.addClass('nav-content-top');

        this.$nav.removeClass('nav-center');
        this.$nav.addClass('nav-top');
        this.$nav.css({"height": this.navTopHeight + "px"})

    },

    transitionHome: function() {

        this._removeScrollHandler();

        this.atHome = true;

        var duration = 900;

        var offset = this.$nav.position();
        var size = {height: this.$nav.height(), width: this.$nav.width()}

        this.$nav.removeClass('nav-top');

        this.$nav.css({
            top: offset.top,
            left: offset.left,
            width: size.width,
            height: size.height,
        });

        this.$nav.children()
                .velocity("stop")
                .velocity(
                    {
                        opacity: 0.0
                    },
                    {
                        duration: duration / 2,
                        complete: function() {
                            this.$nav.removeClass('nav-content-top');                                       
                            this.$nav.addClass('nav-content-center');
                        }.bind(this)
                    }
                ).velocity(
                    {
                        opacity: 1.0
                    },
                    {
                        easing: "easeOut",
                        duration: duration / 2,
                    }
                )

        this.$nav.velocity("stop")
                 .velocity(
            {
                top: $(window).height() * .25,
                width: 300,
                height: 375
            },
            {
                easing: [.52,.12,0,1],
                duration: duration,
                complete: function() {
                    this.$nav.addClass('nav-center');
                }.bind(this)
            }
        );
        
        this.$content.velocity("stop")
                     .velocity(
                         {
                            opacity: 0,
                         },
                         {
                            duration: duration / 3 
                         }
                     )
        this.$contentCon.velocity("stop")
                        .velocity("scroll", {
            offset: -100,
            complete: function() {
                this.$contentCon.hide()
            }.bind(this),
            duration: duration,
            easing: "easOut"
        });
    },
    transitionHeading: function(target) {

        var duration = 900;

        if(this.atHome) {
        this.$nav.children()
                .velocity("stop")
                .velocity(
                    { opacity: 0.0 },
                    {
                        duration: duration / 3,
                        complete: function() {
                            this.$nav.removeClass('nav-content-center');
                            this.$nav.addClass('nav-content-top');                                       
                        }.bind(this)
                    })
                .velocity(
                    { opacity: 1.0 },
                    {
                        easing: "easOut",
                        duration: duration / 3,
                    })
        }

        var offset = this.$nav.position();
        var size = {height: this.$nav.height(), width: this.$nav.width()}

        this.$nav.removeClass('nav-center');

        this.$nav.css({
            top: offset.top,
            left: offset.left,
            width: size.width,
            height: size.height,
        });

        this.$nav.velocity("stop")
                 .velocity(
            {
                top: 10,
                width: $(window).width(),
                height: this.navTopHeight
            },
            {
                easing: [.52,.12,0,1],
                duration: duration,
                complete: function() {
                    this.$nav.attr("style", "");
                    this.$nav.addClass('nav-top');
                    this.$nav.css({"height": this.navTopHeight + "px"})
                    this._registerScrollHandler();
                }.bind(this)
            }
        );

        this.$contentCon.show();
        this.$content.velocity("stop")
                    .velocity(
                        { opacity: 1.0 },
                        {
                            duration: duration / 3 
                        })
                        
        $(target).velocity("scroll", {
            easing: [.37,.04,.02,1.01],
            offset: -100,
            duration: duration
        });

        this.atHome = false;
    },
    transition: function(e) {
        var target = $(e.target).attr('href');
        e.preventDefault();
        window.history.pushState("", "", window.location.pathname + target)
        if(target == "#"){
            this.transitionHome();
        } else {
            this.transitionHeading(target);
        }

        this.currentHash = target;
    },
    hashchange: function() {

        var hash = window.location.hash;
        var prevHash = this.currentHash;
        this.currentHash = hash;

        if(hash == "#" || hash == ""){
            this.gotoHome();
        } else {
            this.gotoHeading(hash);
        }
        return;

        if(prevHash == hash) {
            if(hash == "#" || hash == ""){
                this.gotoHome();
            } else {
                this.gotoHeading(hash);
            }
            return;
        }

        if((prevHash == "#" || prevHash == "") && (hash != "#" || hash != "")) {
            this.transitionHeading(hash);
            return;
        }

        if((prevHash != "#" || prevHash != "") && (hash == "#" || hash == "")) {
            this.transitionHome();
            return;
        }
 
    },
    _registerScrollHandler: function() {
        ScrollController.registerScroll("nav", function(s) {
            if(s < 800){
                ScrollController.removeScroll("nav");
                Nav.transitionHome()
            }
        })
    },
    _removeScrollHandler: function() {
        ScrollController.removeScroll("nav");
    }
}