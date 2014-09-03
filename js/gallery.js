/*globals jQuery, window */
/*jslint plusplus: true, nomen: true, regexp: true, vars: true */

(function ($) {
    "use strict";

    var Gallery = function (data) {
        var instance = this;

        this.index = data.index;
        this.slug = data.slug;
        this.url = this.getURL();
        this.title = data.title;
        this.pictures = [];
        this.$element = null;

        $.each(data.pictures, function (i, name) {
            var picture = {
                src: instance.url + name,
                title: name.replace(/_/g, ' '),
                thumb: new Image()
            };
            picture.thumb.src = instance.url + 'thumbs/' + name;
            instance.pictures.push(picture);
        });
    };

    Gallery.prototype.getURL = function () {
        return this.index.options.url + this.slug + '/';
    };

    Gallery.prototype.getElement = function () {
        if (!this.$element) {
            this.$element = $('<ul class="gallery">').append(
                $.map(this.pictures, function (picture) {
                    return $('<li>').append(
                        $('<a>', {href: picture.src, title: picture.title}).append(
                            $('<img>', {
                                'src': picture.thumb.src,
                                'width': picture.thumb.width,
                                'height': picture.thumb.height,
                                'alt': picture.title,
                                'class': 'shadow'
                            })
                        )
                    )[0];
                })
            ).hide().appendTo(this.index.$element);
            $('a', this.$element).lightBox();
        }
        return this.$element;
    };

    Gallery.prototype.generateLink = function () {
        var gallery = this,
            $link = $('<a href="#">').append([
                $('<img>', {'src': this.index.options.folderImageSrc, 'class': 'shadow'})[0],
                $('<p>').text(this.title)[0]
            ]).click(function () { gallery.show(); });
        return $link;
    };

    Gallery.prototype.show = function () {
        var $element = this.getElement(),
            index = this.index,
            gallery = this;

        index.getIndex().hide();
        $element.fadeIn('slow', function () {
            index.activeItem = gallery;
            index.$backButtons.css('visibility', 'visible');
        });
    };

    var Galleries = function (options) {
        var instance = this;
        this.options = options || {};
        this.items = [];
        this.activeItem = null;
        this.$element = $(this.options.element);
        this.$backButtons = $(this.options.backButtons);
        this.$index = null;

        this.$backButtons.click(function () {
            instance.listIndex();
        });
    };

    Galleries.prototype.loadData = function () {
        var instance = this;
        while (this.items.length) { this.items.pop(); }
        $.getJSON(this.options.index, function (response) {
            $.each(response, function (slug, data) {
                instance.items.push(new Gallery({
                    index: instance,
                    slug: slug,
                    title: data.title,
                    pictures: data.pictures
                }));
            });
            instance.listIndex();
        });
    };

    Galleries.prototype.getIndex = function (force) {
        if (!this.$index || force) {
            this.$index = $('<ul class="galleries">').append(
                $.map(this.items, function (gallery) {
                    return $('<li>').append(gallery.generateLink())[0];
                })
            ).hide().appendTo(this.$element);
        }
        return this.$index;
    };

    Galleries.prototype.listIndex = function (force) {
        if (force) {
            this.$element.html('');
        } else if (this.activeItem) {
            this.activeItem.$element.hide();
        }
        this.activeItem = null;
        this.$backButtons.css('visibility', 'hidden');
        this.getIndex(force).fadeIn('slow');
    };

    window.Galleries = Galleries;
})(jQuery);
