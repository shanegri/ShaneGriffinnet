/// WILL BE REMOVED, ONLY FOR DEV
let includes = ["js/objects/Nav.js", "js/objects/Content.js"];
for(i = 0 ; i < includes.length; i++){
  newScript = document.createElement('script');
  newScript.type = 'text/javascript';
  newScript.src = includes[i];
  document.getElementsByTagName('head')[0].appendChild(newScript);
}
///

let routes = ["", {"Projects":["1", "2"]}, "Photography", "Video"];
var nav = null;
let content = null;

let init = () => {
  nav = new Nav();
  content = new Content();
  router();
}
let router = () => {
  let hash = window.location.hash;
  if(hash == ""){
    console.log("HOME");
    nav.transitionToHome();
    content.hide();
  } else {
    nav.transitionOffHome();
    console.log("NOT HOME")
    content.expand();
  }
}

window.onload = init;
window.onhashchange = router;
window.addEventListener('resize', () => {
  if(nav != null){
    nav.maintainPos();
  }
  if(content != null){
    content.maintainWidth();
  }
});
