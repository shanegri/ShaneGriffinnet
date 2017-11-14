<?php

class Photography implements iComponent {

  var $images;

  public function __construct(){
    $images = scandir("./Images");
    $imgObjs = array();
    for($i = 2 ; $i < count($images); $i++){
      $a = new Image($images[$i], $i-2);
      $imgObjs[] = $a;
    }
    $this->images = $imgObjs;
  }

  public function show(){
    ?>

    <div class="ImageContainer">
      <?php foreach($this->images as $i) { $i->show(); }?>
    </div>

    <div id="ExpandedCover"></div>

    <script type="text/javascript">
      let cursor = 0;
      let imgExpanded = false;
      let imagesExpandedArr = document.getElementsByClassName("galleryPhotoLargeContainer");
      function expandImage(id){
        if(!imgExpanded){
          document.getElementById("ExpandedCover").style.display = "block";
          cursor = id;
          imagesExpandedArr[cursor].style.display = "flex";
          imgExpanded = true;
        }
      }
      function closeImage(){
        for(i = 0 ; i < imagesExpandedArr.length ; i++){
          imagesExpandedArr[i].style.display = "none";
        }
        imgExpanded = false;
        document.getElementById("ExpandedCover").style.display = "none";
      }
      function nextImage(){
        if(cursor < imagesExpandedArr.length-1){
          cursor++;
          closeImage()
          expandImage(cursor)
        }
      }
      function prevImage(){
        if(cursor > 0){
          cursor--;
          closeImage()
          expandImage(cursor)
        }
      }
    </script>
    <?php
  }

}



?>
