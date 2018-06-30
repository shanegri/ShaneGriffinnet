$(function() { App.init() })

var App = {
  init: function(){
    let hash = window.location.hash;
    this.atHome = hash == "#" || hash == "";
    this.nav = new Nav(this.atHome);
    this.$body = $("body");
    this.$content = this.$body.find("#content");
    this.updateHash();
    this.bind();
  },
  gotoHome: function() {
    this.nav.transitionToCenter();
    window.onscroll = null;
    this.$body.velocity("stop");
    this.$content.velocity({opacity: 0.0}, {duration: 300, complete: () => this.$content.hide()});
    this.$body.velocity("scroll",{duration: 1000, easing: "easeOut"});
  },
  gotoHeading: function(heading) {
    this.nav.transitionOffCenter();
    this.$content.show();
    this.$content.css({opacity: 1.0});
    this.$body.velocity("stop");
    $(heading).velocity("stop");
    $(heading).velocity("scroll",
      {
        offset: "-100px",
        duration: 1200,
        easing: [.37,.04,.02,1.01],
        complete: () => {
          window.onscroll = () => {
            if(window.pageYOffset < 900) this.gotoHome("linear");
          }
        }
      }
    )
  },
  updateHash: function(href) {
    if(href) history.pushState(null, null, href);
    href = location.hash;
    href == "#" || href == ""
      ?this.gotoHome("easeOut") 
      :this.gotoHeading(href);
  },
  bind: function() {
    window.onhashchange = () => this.updateHash();
  }
}
