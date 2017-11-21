function Content(){
    this.elem = $(".content");
    this.window = $(window);
    this.bg = $('.main');
    this.cover = $('.cover');
    this.pages = {};

    this.maintainWidth = () => {
      if(!isMobile){
        this.width = this.window.width() - nav.width;
      } else {
        this.width = this.window.width();
      }
      this.elem.css("width", this.width+"px");
    }
    this.expand = () => {
      this.load();
      this.elem.css('opacity', '1');
      this.elem.css("display", "flex");
      this.bg.velocity("stop");
      this.bg.velocity({backgroundColor: colors['blue'], width: "100%"}, 1400, 'easeOutExpo');
    }
    this.hide = () => {
      this.unload();
      this.elem.velocity({opacity: 0});
      this.bg.velocity("stop");
      this.bg.velocity({backgroundColor: colors['white'], width: "100%"}, 1400, 'easeOutExpo');
    }
    this.load = (pageName) => {
      if(this.elem.children().length == 1){
        $.get('/Projects.html', function(data){
          $('.content').prepend(data);
        });
      }
    }
    this.unload = () => {
      console.log('unloaded');
      $('.content-page').remove();
    }
    this.maintainWidth();
}
