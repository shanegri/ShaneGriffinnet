function Content(){
    this.elem = $(".content");
    this.window = $(window);
    this.bg = $('.main');
    this.colors = {"white": "", "yellow": "", "blue": ""}

    this.maintainWidth = () => {
      this.width = this.window.width() - nav.width;
      this.elem.css("width", this.width+"px");
    }
    this.expand = () => {
  //    this.elem.append($('<div>').load("testPage.html"));
      this.elem.css("display", "flex");
      this.bg.velocity("stop");
      this.bg.velocity({backgroundColor: "#fff7dc", width: "100%"}, 1400, 'easeOutExpo');
    }
    this.hide = () => {
      this.elem.css("display", "none");
      this.bg.velocity("stop");
      this.bg.velocity({backgroundColor: "#ffffff", width: "50%"}, 1400, 'easeOutExpo');
    }

    this.maintainWidth();
}
