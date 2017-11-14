<?php
class Image implements iComponent {

  private $path;
  private $id;

  public function __construct($p, $id){
    $this->path = "Images/".$p;
    $this->id = $id;
  }

  public function show(){
    ?>

    <img id="galleryPhoto"
         src="<?php echo $this->path ?>" alt="<?php echo $this->path ?>"
        onclick="expandImage('<?php echo $this->id; ?>');"
        />


    <div class="galleryPhotoLargeContainer">

    <div class="galleryExpanded">
        <p class="arrowLeft" onclick="prevImage()">&#8612</p>
        <img
         class="galleryPhotoLarge"
         src="<?php echo $this->path ?>"
         alt="<?php echo $this->path ?>"
         onclick="closeImage();"
         />
         <p class="arrowRight" onclick="nextImage()">&#8614</p>
    </div>
    </div>
    <?php
  }

}
?>
