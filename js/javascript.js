/// WILL BE REMOVED, ONLY FOR DEV
let includes = ["js/objects/Nav.js", "js/objects/Content.js"];
for(i = 0 ; i < includes.length; i++){
  newScript = document.createElement('script');
  newScript.type = 'text/javascript';
  newScript.src = includes[i];
  document.getElementsByTagName('head')[0].appendChild(newScript);
}
///

var routes = ["", {"Projects":["1", "2"]}, "Photography", "Video"];
var nav = null;
var isMobile = false;
var content = null;
var colors = {"white": "#ffffff", "yellow": "fff7dc", "blue": "#024959"};


let init = () => {
  nav = new Nav();
  content = new Content();
  router();
  resize();
}
let router = () => {
  let hash = window.location.hash;
  if(hash == ""){
    nav.transitionToHome();
    nav.nav_tab.css('display', 'none');
    content.hide();
  } else {
    if(isMobile){
      nav.atCenter = false;
      nav.nav_tab.css('display', 'flex');
      nav.animateTo(nav.window.width());
    } else {
      nav.transitionOffHome();
    }
    content.expand();
  }
}
let resize = () => {
  let aspect = $(window).width() / $(window).height();
  isMobile = aspect <= 1.2;
  if(nav != null){
    nav.maintainPos();
  }
  if(content != null){
    content.maintainWidth();
  }
};


window.onload = init;
window.onhashchange = router;
window.addEventListener('resize', resize);
