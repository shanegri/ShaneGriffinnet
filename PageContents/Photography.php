<?php

$images = scandir("./Images");
$imgObjs = array();
for($i = 2 ; $i < count($images); $i++){
  $a = new Image($images[$i], $i-2);
  $imgObjs[] = $a;
}

?>

<div class="ImageContainer">
  <?php foreach($imgObjs as $i) { $i->show(); }?>
</div>
</>

<!-TODO: MOVE TO styles.css
       : FIX GALLERY ALIGNMENT
 ->
<style media="screen">
.ImageContainer {
  line-height: 0px;
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;

}

#galleryPhoto {
  display: inline-block;
  height: 150px;
  width: 150px;
}

#galleryPhotoCover {
  background-color: rgba(255,255,255,0);
  -webkit-transition: background-color .5s; /* Safari */
  transition: background-color .5s;
  width: 100%;
  height: 100%;
}

#galleryPhotoCover:hover {
  background-color: rgba(255,255,255, .75);\
}

.galleryPhotoLarge {
  display: none;
  position: fixed;
  width: 50%;
  left: 0;
  right: 0;
  top: 0;
  bottom:0;
  margin: auto;
}
</style>
<script type="text/javascript">
  let cursor = 0;
  let imgExpanded = false;
  let expandedImage = null;
  function expandImage(id){
    if(!imgExpanded){
      elem = document.getElementById(id);
      elem.style.display = "block";
      imgExpanded = true;
    }
  }
  function closeImage(id){
    imgExpanded = false;
    elem = document.getElementById(id);
    elem.style.display = "none";
  }
  function nextImage(){

  }
  function prevImage(){

  }
</script>
