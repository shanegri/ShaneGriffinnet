<?php
require_once("mainPage.php");

//Get uri
$URI = $_SERVER['REQUEST_URI'];
$URI_EXPLODE = explode("/", $URI);

//Constants
$HOME = "TEMP";
$NOT_FOUND = "PAGE_NOT_FOUND";
$BASE = "PageContents/";
$PHP_EXT = ".php";

//Page name + default page
$cName = $URI_EXPLODE[1];
$cUrl = $BASE . $BASE . $PHP_EXT;

//Determine if on home page
if ($URI_EXPLODE[1] == "" && $URI_EXPLODE[2]== ""){
  $cUrl = $BASE . $HOME . $PHP_EXT;
  $cName = $HOME;
} else {
  $cUrl = $BASE . $cName . $PHP_EXT;
}

//Check if page exists
if(!file_exists($cUrl)){
  $cUrl = $BASE . $NOT_FOUND . $PHP_EXT;
  $cName = $NOT_FOUND;
}


//Clean up content name
$cName = str_replace("_", " ", $cName);


// echo $cUrl;
// echo '<br>';
showMainPage($cUrl, $cName);




?>


<! FOR AUTO RELOADING REMOVE BEFORE FINAL PUSH >
<script src="http://localhost:35729/livereload.js" charset="utf-8"></script>
