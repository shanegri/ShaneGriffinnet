<?php 

//BLOCK-SKIP
header('Access-Control-Allow-Origin: http://127.0.0.1:5500');
//BLOCK-CONTINUE 

try {

    $result = array("status"=>"good");
    $dir =  scandir(getcwd() . "/../images/thumb");

    $images = array();

    unset($dir[0]);
    unset($dir[1]);

    foreach($dir as $key => $value) { array_push($images, $value); }

    $result['images'] = $images;

} catch (Exception $e) {
    $result = array("status"=>"error");
}

echo json_encode($result);

?>