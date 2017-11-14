<?php
require_once("mainPage.php");
$validNames = ["Photography", "Welcome"];

function __autoload($class_name) {
    require_once('php/'.$class_name.'.php');
}

//Get uri
$URI = $_SERVER['REQUEST_URI'];
$path = explode("/", $URI)[1];


if(in_array($path, $validNames)){
  $type = $path;
} else {
  $type = 'Welcome';
}

$content = new $type;

$App = new MainPage($content, $type);
$App->show();


?>


<! FOR AUTO RELOADING REMOVE BEFORE FINAL PUSH >
<script src="http://localhost:35729/livereload.js" charset="utf-8"></script>
