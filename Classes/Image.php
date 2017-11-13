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

    <!-- <img id="galleryPhoto" src="<?php echo $this->path ?>" alt="<?php echo $this->path ?>"/>  -->
    <div id="galleryPhoto"
         style="background: url(<?php echo $this->path ?>);
                background-size: cover;"
         onclick="expandImage('<?php echo "gpl".$this->id; ?>');"
    >
      <div id="galleryPhotoCover"></div>
    </div>
    <img id="<?php echo "gpl".$this->id;?>"
         class="galleryPhotoLarge"
         src="<?php echo $this->path ?>"
         alt="<?php echo $this->path ?>"
         onclick="closeImage('<?php echo "gpl".$this->id; ?>');"
         />
    <?php
  }

}
?>
