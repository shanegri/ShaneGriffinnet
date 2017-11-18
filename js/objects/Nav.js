function Nav(initPos){
  this.elem = $(".nav");
  this.nav_content = $(".nav-content");
  this.atCenter = true;
  this.width = 400;

  this.init = (newPos) => {
    this.elem.css("width", this.width + "px");
    this.elem.css("right", (-1 * this.width) + "px");
    this.nav_content.delay(200).animate({opacity: "1", top: "15%"}, {duration: 1400, easing: 'easeOutExpo'});
    this.goTo(this.findNavCenter());
  }
  this.animateTo = (newPos) => {
    this.elem.stop(true, true);
    $(".nav").animate({right: newPos + "px"}, {duration: 1400, easing: 'easeOutExpo'});
  }
  this.goTo = (newPos) => {
    this.elem.stop(true, true);
    this.elem.css("right", newPos+"px");
  }
  this.findNavCenter = () => {
    let width = $(window).width();
    let navCenter = (width / 2) - (this.width / 2);
    return navCenter;
  }
  this.findNavPos = () => {
    let width = $(window).width();
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
    let newPos = $(window).width() - nav.width;
    this.atCenter = false;
    $(".main").animate({backgroundColor: "rgb(255,247, 220)", width: "100%"}, 1400, 'easeOutExpo');
    this.animateTo(newPos);
  }

  this.init(initPos);
}
