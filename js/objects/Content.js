function Content(){
    this.elem = $(".content");
    this.window = $(window);
    this.bg = $('.main');
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
      this.elem.velocity({opacity: 0});
      this.bg.velocity("stop");
      this.bg.velocity({backgroundColor: colors['white'], width: "50%"}, 1400, 'easeOutExpo');
    }
    this.load = () => {
      if(this.elem.children().length == 1){
        $.get('testPage.html', function(data){
          $('.content').prepend(data);
        });
      }
    }
    this.maintainWidth();
}
