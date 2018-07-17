/*globals jQuery, window */
/*jslint plusplus: true, nomen: true, regexp: true, vars: true */

(function ($) {
    "use strict";

    function Gallery (data) {
      this.index = data.index;
      this.slug = data.slug;
      this.url = data.url;
      this.title = data.title;
      this.$element = null;
      this.pictures = $.map(data.pictures, function (name) {
        return {
          src: this.url + name,
          title: name.replace(/[_\-]/g, ' ').split('.')[0],
          thumb: {
            src: this.url + 'thumbs/' + name
          }
        };
      }.bind(this));
    };

    Gallery.prototype.getThumbnailUrl = function () {
      return this.pictures[0].thumb.src;
    }

    Gallery.prototype.getElement = function () {
        if (!this.$element) {
          this.$element = this.render().hide().insertAfter(this.index.$element);
          $('a', this.$element).lightBox();
        }
        return this.$element;
    };

    Gallery.prototype.render = function () {
      return $('<ul>', {
        'class': 'card-columns',
        'id': this.url
      }).append(
        $.map(this.pictures, this.renderPicture)
      );
    }

    Gallery.prototype.renderPicture = function (picture) {
      return $('<li class="card">').append(
        $('<a>', {
          'href': picture.src,
          'title': picture.title
        }).append(
          $('<img>', {
            'src': picture.thumb.src,
            'alt': picture.title,
            'class': 'card-img-top'
          })
        )
      );
    }

    function Galleries (options) {
      this.options = options || {};
      this.items = [];
      this.$element = $(this.options.element);
      this.$backButtons = $(this.options.backButtons);

      this.$backButtons.on('click', function(e) {
        this.listIndex()
        e.preventDefault();
      }.bind(this));
      this.$element.on('click', 'a[data-gallery]', function (e) {
        var $card = $(e.currentTarget).closest('.card');
        this.showGallery($card.data('gallery'));
        e.preventDefault();
      }.bind(this));
    };

    Galleries.prototype.loadData = function () {
      $.ajax({
        url: this.options.index,
        context: this,
        dataType: 'json',
      }).done(function (response) {
        this.items = $.map(response, function (data, slug) {
          return new Gallery({
            index: this,
            slug: slug,
            url: this.options.url + slug + '/',
            title: data.title,
            pictures: data.pictures
          });
        }.bind(this));
        this.render();
        this.listIndex();
      });
    };

    Galleries.prototype.render = function () {
      this.$element.html('');
      var elements = $.map(this.items, this.renderGaleryCard);
      this.$element.append(elements);
    }

    Galleries.prototype.renderGaleryCard = function(gallery) {
      var url = '#' + gallery.url;
      var $card = $('<li class="card">').append(
        $('<a>', {
          'href': url,
          'data-gallery': gallery.slug
        }).append(
          $('<img>', {
            'src': gallery.getThumbnailUrl(),
            'class': 'card-img-top',
          })
        )
      ).append(
        $('<div class="card-body text-center">').append(
          $('<a>', {
            'href': url,
            'class': 'h4',
            'data-gallery': gallery.slug
          }).text(gallery.title)
        )
      ).data('gallery', gallery);
      return $card;
    }

    Galleries.prototype.showGallery = function(gallery) {
      var $el = gallery.getElement();
      this.$element.hide();
      $el.fadeIn('slow', function () {
        this.$backButtons.css('visibility', 'visible');
      }.bind(this));
    }
    Galleries.prototype.listIndex = function (e) {
      var loadedGalleries = $.map(this.items, function(item) {
        return item.$element ? item.$element.get(0) : null;
      }).filter(Boolean);
      $(loadedGalleries).hide();
      this.$backButtons.css('visibility', 'hidden');
      this.$element.fadeIn('slow');
    };

    window.Galleries = Galleries;
})(jQuery);
