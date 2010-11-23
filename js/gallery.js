var galleries_obj;
  
function galleryShow(gallery) {
  pictures = galleries_obj[gallery].pictures;
  debug(pictures);
  $('#galleries_list').slideUp('slow');
  $('#gallery_list').html('');
  for (picture in pictures) {
    picture = pictures[picture];
    g_location = 'gallery/'+gallery+'/';
    pic_location = g_location + picture;
    thumb_pic = g_location + 'thumbs/' + picture;
    picture = picture.replace(/_/g, ' ');
    $('#gallery_list').append('<li><a href="'+pic_location+'"><img src="'+thumb_pic+'" width="100" height="100" alt="" class="shadow" /></a><p>'+picture+'</p></li>');
  }
  $('#gallery_list').slideDown('slow', function(){$('.backToGalleries').show();});
  $('#gallery_list a').lightBox();
  
}

function listGalleries(galleries) {
  if (galleries == undefined) galleries = galleries_obj;
  //debug(galleries);
  $('#gallery_list').slideUp('slow');
  $('.backToGalleries').hide();
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

function loadGallery() {
  $.getJSON('js/gallery.json', function(data) {galleries_obj = data; listGalleries(data)});
}

$(document).ready(function(){
  if (galleries_obj == undefined) loadGallery();
});