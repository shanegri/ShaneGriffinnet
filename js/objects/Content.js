function Content(Nav){
    this.elem = $(".content");
    this.content = $(".content-page")
    this.window = $(window);
    this.nav = Nav;

    this.maintainWidth = () => {
      this.width = this.window.width() - this.nav.width;
      this.elem.css("width", this.width+"px");
    }

    this.expand = () => {
      this.content.load("testPage.html");
      this.elem.css("display", "flex");
    }
    this.hide = () => {
      this.elem.css("display", "none");
    }

    this.maintainWidth();

}
