function Nav(initPos){
  this.elem = $(".nav");
  this.nav_content = $(".nav-content");
  this.nav_tab = $('.nav-tab');
  this.bg = $(".main");
  this.window =$(window);
  this.atCenter = true;
  this.width = 400;

  this.init = (newPos) => {
    this.elem.css("width", this.width + "px");
    this.elem.css("right", (-1 * this.width) + "px");
    this.nav_content.delay(200).velocity({opacity: "1", top: "15%"}, {duration: 1400, easing: 'easeOutExpo'});
    this.goTo(this.findNavCenter());
  }
  this.animateTo = (newPos) => {
    this.elem.velocity("stop");
    this.elem.velocity({right: newPos + "px"}, {duration: 1400, easing: 'easeOutExpo'});
  }
  this.goTo = (newPos) => {
    this.elem.velocity("stop");
    this.elem.css("right", newPos+"px");
  }
  this.findNavCenter = () => {
    let width = this.window.width();
    let navCenter = (width / 2) - (this.width / 2);
    return navCenter;
  }
  this.findNavPos = () => {
    let width = this.window.width();
    return width - this.width;
  }

  this.maintainPos = () => {
    if(this.atCenter){
      this.nav_tab.css('display', 'none');
      this.goTo(this.findNavCenter());
    } else {
      if(isMobile){
        this.nav_tab.css('display', 'flex');
        this.goTo(this.window.width());
      } else {
        this.nav_tab.css('display', 'none');
        this.goTo(this.findNavPos());
      }
    }
  }
  this.transitionOffHome = () => {
    if(this.atCenter){
      let newPos = this.window.width() - nav.width;
      this.atCenter = false;
      this.animateTo(newPos);
    }
  }
  this.transitionToHome = () => {
    if(!this.atCenter){
      this.atCenter = true;
      this.animateTo(this.findNavCenter());
    }
  }
  this.toggleHidden = () => {
    this.elem.velocity('stop');
    if(this.elem.css('right') == this.window.width()+("px")){
      let newPos = this.window.width() - nav.width;
      this.animateTo(newPos);
    } else {
      this.animateTo(this.window.width());
    }
  }

  this.init(initPos);
}
