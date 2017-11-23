function Transition(){
  this.elem = $('.cover');
  this.elem.css('width', '0%');
  this.elem.css('background', 'black');

  this.transition = (useTransition, callback) => {
    console.log(useTransition);
    let transitionFinish = () => {
      callback();
      this.elem.velocity({width: "0%"});
    }
    if(useTransition == false){
      this.elem.velocity({width: "100%"}, {complete: transitionFinish });
    } else {
      callback();
    }

  }

}
