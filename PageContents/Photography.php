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
<div id="ExpandedCover">

</div>

</>

<!-TODO: MOVE TO styles.css
       : FIX GALLERY ALIGNMENT
 ->
<style media="screen">
#ExpandedCover {
  display: none;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.5);
  position: fixed;
  top: 0;
  left: 0;

}
.ImageContainer {
  line-height: 0px;
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;

  display: -webkit-inline-flex; /* Safari */
  -webkit-justify-content: center; /* Safari 6.1+ */
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
  z-index: 1;
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
      document.getElementById("ExpandedCover").style.display = "block";
      elem = document.getElementById(id);
      elem.style.display = "block";
      imgExpanded = true;
    }
  }
  function closeImage(id){
    imgExpanded = false;
    document.getElementById("ExpandedCover").style.display = "none";
    elem = document.getElementById(id);
    elem.style.display = "none";
  }
  function nextImage(){

  }
  function prevImage(){

  }
</script>
