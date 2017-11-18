let includes = ["js/objects/Nav.js"];
let routes = ["", {"Projects":["1", "2"]}, "Photography", "Video"];


for(i = 0 ; i < includes.length; i++){
  newScript = document.createElement('script');
  newScript.type = 'text/javascript';
  newScript.src = includes[i];
  document.getElementsByTagName('head')[0].appendChild(newScript);
}


let nav = null;
window.onload = function () {
  nav = new Nav();
}

window.addEventListener('resize', () => {
  if(nav != null){
    nav.maintainPos();
  }
});

function transitionOffHome(){
  if(nav != null) nav.transitionOffHome();
}
