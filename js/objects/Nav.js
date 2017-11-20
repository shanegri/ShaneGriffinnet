function Nav(initPos){
  this.elem = $(".nav");
  this.nav_content = $(".nav-content");
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
    this.elem.stop(true, true);
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
      this.goTo(this.findNavCenter());
    } else {
      this.goTo(this.findNavPos());
    }
  }
  this.transitionOffHome = () => {
    if(this.atCenter){
      let newPos = this.window.width() - nav.width;
      this.atCenter = false;
      this.bg.velocity("stop");
      this.bg.velocity({backgroundColor: "#fff7dc", width: "100%"}, 1400, 'easeOutExpo');
      this.animateTo(newPos);
    }
  }
  this.transitionToHome = () => {
    if(!this.atCenter){
      this.atCenter = true;
      this.bg.velocity("stop");
      this.bg.velocity({backgroundColor: "#ffffff", width: "50%"}, 1400, 'easeOutExpo');
      this.animateTo(this.findNavCenter());
    }
  }

  this.init(initPos);
}
