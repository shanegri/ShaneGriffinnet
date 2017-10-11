<?php
require_once("mainPage.php");

$URI = $_SERVER['REQUEST_URI'];
$URI_EXPLODE = explode("/", $URI);

$Content = $URI_EXPLODE[1];
if($URI_EXPLODE[1] == "" && $URI_EXPLODE[2]== ""){
  $Content ="TEMP";
}

$pages = json_decode(file_get_contents("pages.json"), true);
if(!in_array($Content, $pages['Pages'])){
  $Content = "PAGE_NOT_FOUND";
}



showMainPage($Content, $Content);




?>


<! FOR AUTO RELOADING REMOVE BEFORE FINAL PUSH >
<script src="http://localhost:35729/livereload.js" charset="utf-8"></script>
