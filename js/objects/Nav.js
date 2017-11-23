function Nav(initPos){
  this.elem = $(".nav");
  this.nav_content = $(".nav-content");
  this.nav_tab = $('.nav-tab');
  this.window =$(window);
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
    if(isCenter){
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
    if(isMobile){
      nav.nav_tab.css('display', 'flex');
      nav.animateTo(nav.window.width());
    } else {
      let newPos = this.window.width() - nav.width;
      this.animateTo(newPos);
    }
  }
  this.transitionToHome = () => {
    this.animateTo(this.findNavCenter());
    nav.nav_tab.css('display', 'none');
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
