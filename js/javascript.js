///SKIP
let includes = ["js/objects/Nav.js", "js/objects/Content.js", "js/objects/Transition.js", "js/objects/Gallery.js"];
for(i = 0 ; i < includes.length; i++){
  newScript = document.createElement('script');
  newScript.type = 'text/javascript';
  newScript.src = includes[i];
  document.getElementsByTagName('head')[0].appendChild(newScript);
}
///CONTINUE

var routes = ['Projects', 'Photography', 'Video'];
var colors = {"white": "#ffffff", "yellow": "#EDC85A", "blue": "#055F76", "dark-grey":"#181A1B"};
var routeColors = {'Projects': colors['blue'],
                   'Video' : colors['yellow'],
                   'Photography': colors['dark-grey']};
var nav = null;
var content = null;
var isMobile = false;
var isCenter = true;

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
    content.hide();
    isCenter = true;
  } else {
    content.expand(hash.slice(1, hash.length));
    nav.transitionOffHome();
    isCenter = false;
  }
}
let resize = () => {
  let aspect = $(window).width() / $(window).height();
  isMobile = aspect <= 1.2;
  if(nav != null){ nav.maintainPos(); }
  if(content != null){ content.maintainWidth();}
  if(typeof gallery !== "undefined") {
    gallery.setImageSize();
  }
};


window.onload = init;
window.onhashchange = router;
window.addEventListener('resize', resize);
