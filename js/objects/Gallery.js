function Gallery(){

  this.elem = $('.content-images');
  this.images = new Array();

  this.getImages = () => {
    let images = this.images;
    let url = window.location.protocol + "//"
              + window.location.hostname + "/Images/Gallery/";
    $.ajax({
      url: url,
      success: (data) => {
        $(data).find("td > a").each(function(i){
          if(i != 0){ images.push(new Img($(this).attr("href"))); }
        })
        this.images = images;
        this.init();
      }
    });
  }

  this.init = () => {
    this.elem = $('.content-images');
    this.images.forEach((elem, i) => {
      this.elem.append("<img class='galImg' src="+elem.src+" id="+i+" alt="+i+"/>");
    });
  }

  this.getImages();

}

function Img(src){
  this.src = 'Images/Gallery/' + src;
  this.thumb = 'Images/Gallery/thumb-' + src;
  this.descript = '';


}
