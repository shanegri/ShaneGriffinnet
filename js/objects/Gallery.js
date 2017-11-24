function Gallery(){


  this.images = new Array();
  this.getImages = () => {
    let images = this.images;
    let url = window.location.protocol + "//"
              + window.location.hostname + "/Images/Gallery/";
    $.ajax({
      url: url,
      success: (data) => {
        $(data).find("td > a").each(function(i){
          if(i != 0){
            ($(this).attr("href"));
          }
        })
      }
    });
  }


  this.init = () => {

  }

  this.getImages();
  console.log(this.images);
}

function Image(){


}
