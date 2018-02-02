function Gallery(){

  this.imgHolder = null;
  this.imgLargeHolder = null;
  this.images = new Array();
  this.counter = 0;
  this.loading = document.getElementById("loading")

  this.getImages = () => {
    let images = this.images;
    let url = window.location.protocol + "//"
              + window.location.hostname + "/Images/Gallery/";
    $.ajax({
      url: url,
      success: (data) => {
        $(data).find("td > a").each(function(i){
          if(i != 0){ images.push(new Img($(this).attr("href"), "gal"+i)); }
        })
        this.images = images;
        this.init();
      },
      error: (message) => {
        console.log(message)
      }
    });
  }
  this.init = () => {
    this.imgHolder = $('.content-images');
    this.imgLargeHolder = $('.content-images-large');
    this.images.forEach((img, i) => {
      let imgHTML = "<img class='galImg' src='' onclick='expandGalleryImage("+i+")' id="+img.srcID+" alt="+i+"/>"
      this.imgHolder.append("<div class='galImgContainer'>"+imgHTML+"</div>")
      this.imgLargeHolder.append("<img class='galImgLarge' src='' id="+"large"+img.srcID+" alt="+"large"+i+"/>");
      img.imElem = document.getElementById(img.srcID);
      img.imElemLarge = document.getElementById("large" + img.srcID);

    });
    let ArrayToLoadFrom = this.images.slice(0, this.images.length);
    this.setImageSize();
    this.loadRandomImage(ArrayToLoadFrom);
  }
  this.loadRandomImage = (ArrayToLoadFrom) => {
    if(ArrayToLoadFrom.length != 0){
      shuffleArray(ArrayToLoadFrom);
      let im = ArrayToLoadFrom.pop();
      im.load(ArrayToLoadFrom, this.loadRandomImage);
    }
  }
  this.setImageSize = () => {
    let totalWidth = content.width;
    let height = Math.floor(totalWidth * .166);
    let numRows = Math.ceil(this.images.length / 6);
    this.imgHolder.css('grid-template-columns', 'repeat(6, '+height+'px)')
    this.imgHolder.css('grid-template-rows', 'repeat('+numRows+', '+height+'px)')
  }
  this.showLargeImage = (i) => {
    this.counter = i;
    this.imgLargeHolder.css('display', 'flex');
    this.loading.style.display = "block";
    this.images[this.counter].loadLargeImage();
  }
  this.hideLargeImage = () => {
    this.imgLargeHolder.css('display', 'none');
    this.images[this.counter].hideLargeImage();
  }
  this.getImages();
}

function Img(src, id){
  this.srcID = id;
  this.src = 'Images/Gallery/' + src;
  this.src_thumb = 'Images/Gallery-Thumb/thumb-' + src;
  this.srcOBJ = new Image();
  this.srcOBJLarge = new Image();
  this.imElem = null;
  this.imElemLarge = null;

  this.load = (ArrayToLoadFrom, callback) => {
    this.srcOBJ.onload = () => {
      this.imElem.src = this.src_thumb;
      callback(ArrayToLoadFrom);
    }
    this.srcOBJ.src = this.src_thumb;
  }
  this.loadLargeImage = () => {
    loading = document.getElementById("loading");
    this.srcOBJLarge.onload = () => {
      loading.style.display = "none";
      this.imElemLarge.src = this.src;
      this.imElemLarge.style.display = "block";
    }
    this.srcOBJLarge.src = this.src;
  }
  this.hideLargeImage = () => { this.imElemLarge.style.display = "none"; }

}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
function expandGalleryImage(i){ gallery.showLargeImage(i); }
function hideGalleryImage() { gallery.hideLargeImage(); }
