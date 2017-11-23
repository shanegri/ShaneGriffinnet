function Content(){
    this.elem = $(".content");
    this.window = $(window);
    this.bg = $('.main');
    this.cover = $('.cover');
    this.pages = {};
    this.transition = new Transition();
    this.bgColor = colors['white'];

    this.maintainWidth = () => {
      if(!isMobile){
        this.width = this.window.width() - nav.width;
      } else {
        this.width = this.window.width();
      }
      this.elem.css("width", this.width+"px");
    }
    this.expand = (pageName) => {
      this.load(pageName);
      this.elem.css('opacity', '1');
      this.elem.css("display", "flex");
      this.bg.velocity("stop");
      this.bg.velocity({backgroundColor: this.bgColor, width: "100%"}, 1400, 'easeOutExpo');
    }
    this.hide = () => {
      this.elem.velocity({opacity: 0});
      this.bg.velocity("stop");
      this.bg.velocity({backgroundColor: colors['white'], width: "100%"}, 1400, 'easeOutExpo');
    }
    this.load = (pageName) => {
      let useTransition = new Boolean(isCenter);
      let handelData = (data) => {
        console.log("loading new page");
        this.pages[pageName] = data;
        this.append(pageName, useTransition);
      }
      if(routes.includes(pageName)){
        this.bgColor = routeColors[pageName];
        if(!(pageName in this.pages)){
          $.get('/'+pageName+'.html', handelData);
        } else {
          this.append(pageName, useTransition);
        }
      } else {
        $('.content-page').remove();
        console.log("invalid")
      }
    }
    this.append = (pageName, useTransition) => {
      if(this.elem.children().length == 2){
        this.transition.transition(useTransition, () => {
          $('.content-page').remove();
          this.elem.prepend(this.pages[pageName]);
        });
      }
    }

    this.maintainWidth();
}
