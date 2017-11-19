/// WILL BE REMOVED, ONLY FOR DEV
let includes = ["js/objects/Nav.js"];
for(i = 0 ; i < includes.length; i++){
  newScript = document.createElement('script');
  newScript.type = 'text/javascript';
  newScript.src = includes[i];
  document.getElementsByTagName('head')[0].appendChild(newScript);
}
///

let routes = ["", {"Projects":["1", "2"]}, "Photography", "Video"];
let nav = null;
let atHome = true;
let currentRoute = "";

let init = () => {
  nav = new Nav();
}
window.onload = init;
window.onhashchange = () => {
  let hash = window.location.hash;
  if(hash.length == 0 && !atHome){
    transitionToHome();
    console.log("Going home");
  } else if(atHome){
    transitionOffHome();
    currentRoute = hash;
    console.log("opening content + current route updated");
  } else if(currentRoute != hash){
    console.log("current route updated");
  }
}

window.addEventListener('resize', () => {
  if(nav != null){
    nav.maintainPos();
  }
});

function transitionOffHome(){
  if(nav != null) {
    nav.transitionOffHome();
    atHome = false;
  };
}


function transitionToHome(){
  if(nav != null) {
    nav.transitionToHome();
    atHome = true;
  }
}
