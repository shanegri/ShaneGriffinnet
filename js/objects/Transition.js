function Transition(){
  this.elem = $('.cover');
  this.elem.css('width', '0%');
  this.elem.css('background', 'white');

  this.transition = (useTransition, callback) => {
    let transitionFinish = () => {
      callback();
      this.elem.css('right', '0');
      this.elem.velocity({width: "0%"}, {complete: () => {
        this.elem.css('right', 'auto');
      }, transition: 'easeOutSin', duration: 700});
    }
    if(useTransition == false){
      options = {
        complete: transitionFinish,
        duration: 700,
        transition: 'easeInQuart'
      }
      this.elem.velocity({width: "100%"}, options);
    } else {
      callback();
    }
  }

}
