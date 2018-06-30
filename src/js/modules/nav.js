class Nav {
    constructor(startAtCenter) {
        this.atCenter = startAtCenter;
        this.scrollPercent = 0;
        this.$nav = $("#nav-container");
        this.$nav.attr('class',this.atCenter ? "nav-center" : "nav-top");
        this.$nav.show();
        this.bindHandlers();
    }
    
    transitionOffCenter() {
        this.atCenter = false;
        this.$nav.children().velocity("stop");
        this.$nav.velocity("stop");
        this.$nav.children().velocity(
            { opacity: 0.0 },
            {   
                duration: 300,
                complete: () => {
                    this.$nav.removeClass("nav-center");
                    this.$nav.addClass("nav-top");
                }
            }
        ).velocity({opacity: 1.0},{duration: 200});
        this.$nav.velocity(
            {
                top: 10, 
                width: $(window).width() * .98, 
                height: 70
            },
            {
                duration: 1000,
                easing: [.52,.12,0,1],
                complete: () => this.$nav.css({width: "98%"})
            }
        );
    }
    transitionToCenter() {

        this.atCenter = true;
        let navHeight = this.$nav.height();
        this.$nav.children().velocity("stop");
        this.$nav.velocity("stop");
        this.$nav.children().velocity(
            { opacity: 0.0 },
            {   
                duration: 300,
                complete: () => {
                    this.$nav.removeClass("nav-top");
                    this.$nav.addClass("nav-center");
                }
            }
        ).velocity({opacity: 1.0},{duration: 200});
        this.$nav.velocity(
            {
                top: ($(window).height()/2) - (375 / 2), 
                width: 300, 
                height: 375
            },
            {
                duration: 1000,
                easing: [.52,.12,0,1]
            }
        );
    }
    navButtonHandler(e){
        e.preventDefault();
        App.updateHash(e.target.href);
    }
    bindHandlers(){
        this.$nav.find('a').on('click', this.navButtonHandler.bind(this));
    }

}