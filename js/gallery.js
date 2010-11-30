var galleries_obj;

function galleryShow(gallery) {
  gallery = galleries_obj[gallery]
  pictures = gallery.pictures;
  $('#galleries_list').slideUp('slow');
  $('#gallery_list').html('');
  for (item in pictures) {
    picture = pictures[item];
    $('#gallery_list').append('<li><a href="'+picture.src+'"><img src="'+picture.thumb.src+'" width="100" height="100" alt="" class="shadow" /></a><p>'+picture.title+'</p></li>');
  }
  $('#gallery_list a').lightBox();
  $('#gallery_list').slideDown('slow', function(){$('.backToGalleries').css('visibility', 'visible');});

}

function listGalleries(galleries) {
  if (galleries == undefined) galleries = galleries_obj;
  $('#gallery_list').slideUp('slow');
  $('.backToGalleries').css('visibility', 'hidden');
  $('#galleries_list').html('');
  for (gallery in galleries) {
    gallery_obj = galleries[gallery];
    $('#galleries_list').append('<li><a href="javascript:void(0)" id="gallery_'+gallery+'" name="'+gallery+'"><img src="img/gallery-folder.png" class="shadow" /><p>'+gallery_obj.title+'</p></a></li>');
    $('#gallery_'+gallery).click(function(){
      gallery = $(this).attr('name');
      galleryShow(gallery);
    });
  }
  $('#galleries_list').slideDown('slow');
}

function loadGalleryData() {
  $.getJSON('js/gallery.json', function(data) {
    //console.log(data);

    for (gallery in data) {
        gallery_obj = data[gallery];
        pictures = gallery_obj.pictures
        gallery_obj.pictures_obj = {}
        for (item in pictures) {
            picture = pictures[item];
            g_location = 'gallery/'+gallery+'/';
            pic_location = g_location + picture;
            thumb_pic = new Image();
            thumb_pic.src = g_location + 'thumbs/' + picture;;
            gallery_obj.pictures_obj[item] = {'src':pic_location, 'thumb':thumb_pic, 'title': picture.replace(/_/g, ' ')}
        };
        gallery_obj.pictures = gallery_obj.pictures_obj
        delete gallery_obj.pictures_obj
    }

    galleries_obj = data;

    listGalleries(data)
  });
}

$(document).ready(function(){
  if (galleries_obj == undefined) loadGalleryData();
});
