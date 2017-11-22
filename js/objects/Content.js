function Content(){
    this.elem = $(".content");
    this.window = $(window);
    this.bg = $('.main');
    this.cover = $('.cover');
    this.pages = {};
    this.currentPage = '';

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
      this.bg.velocity({backgroundColor: colors['blue'], width: "100%"}, 1400, 'easeOutExpo');
    }
    this.hide = () => {
      this.elem.velocity({opacity: 0});
      this.bg.velocity("stop");
      this.bg.velocity({backgroundColor: colors['white'], width: "100%"}, 1400, 'easeOutExpo');
    }
    this.load = (pageName) => {
      let handelData = (data) => {
        console.log("loading new page");
        this.pages[pageName] = data;
        this.append(pageName);
      }
      if(routes.includes(pageName)){
        if(!(pageName in this.pages)){
          $.get('/'+pageName+'.html', handelData);
        } else {
          this.append(pageName);
        }
      } else {
        $('.content-page').remove();
        console.log("invalid")
      }
    }
    this.append = (pageName) => {
      $('.content-page').remove();
      if(this.elem.children().length == 1){
        this.elem.prepend(this.pages[pageName]);
      }
    }

    this.maintainWidth();
}
