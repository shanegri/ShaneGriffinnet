function Gallery(){

  this.imgHolder = $('.content-images');
  this.images = new Array();

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
      }
    });
  }

  this.init = () => {
    this.imgHolder = $('.content-images');
    this.images.forEach((img, i) => {
      let imgHTML = "<img class='galImg' src='' id="+img.srcID+" alt="+i+"/>"
      this.imgHolder.append("<div class='galImgContainer'>"+imgHTML+"</div>")
      img.imElem = document.getElementById(img.srcID);
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
  this.getImages();
}

function Img(src, id){
  this.srcID = id;
  this.src = 'Images/Gallery/' + src;
  this.srcOBJ = new Image();
  this.srcIsLoaded = false;
  this.imElem = null;

  this.load = (ArrayToLoadFrom, callback) => {
    this.srcOBJ.onload = () => {
      this.imElem.src = this.src;
      callback(ArrayToLoadFrom);
    }
    this.srcOBJ.src = this.src;
  }

}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
