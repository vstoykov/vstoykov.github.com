#!/bin/bash
#####################################
#                                   #
# Convert Current folder to Gallery #
#                                   #
#####################################

echo "Initialize variables"
    gallery=`zenity --entry --text="Enter gallery Name"`
    gallery_dir=$(echo $gallery | tr ' ' _)
    gallery_dir=${gallery_dir,,}
    maxwidth=1024
    maxwidththumb=100
    maxheight=768
    maxheightthumb=100
    jsonfile="$gallery_dir/gallery.json"

(    
echo "Rename files to remove spaces (replaces spaces with '_' )"

    for f in *; do
    file=$(echo $f | tr ' ' _)
    [ ! -f $file ] && mv "$f" $file
    done

echo "Resize originals to uploadable images"

    #create directories
    mkdir -p $gallery_dir/thumbs
    echo "\"$gallery_dir\": {" > $jsonfile
    echo "  \"title\": \"$gallery\"," >> $jsonfile
    echo "  \"pictures\": [" >> $jsonfile
    for line in `ls | grep -i "\."jpg$`
    do
        ##get width and height of image

        #sets $width to width of image in pixels
        width=`identify -format "%[fx:w]" $line`

        #sets $height to height of image in pixels
        height=`identify -format "%[fx:h]" $line`

        ##figure out if image is portrait or landscape
        echo "    \"$line\"," >> $jsonfile

        if [ $width -gt $height ]
        then
            #if landscape, resize as landscape
            echo convert -resize "$maxwidth"x"$maxheight" $line $gallery_dir/$line
            convert -resize "$maxwidth"x"$maxheight" $line $gallery_dir/$line
            convert -resize "$maxwidththumb"x"$maxheightthumb" $line $gallery_dir/thumbs/$line
        else
            #if portrait, resize as portrait
            echo convert -resize "$maxheight"x"$maxwidth" $line $gallery_dir/$line
            convert -resize "$maxheight"x"$maxwidth" $line $gallery_dir/$line
            convert -resize "$maxheightthumb"x"$maxwidththumb" $line $gallery_dir/thumbs/$line
        fi
    done
    echo "  ]" >> $jsonfile
    echo '}' >> $jsonfile
) | zenity --progress --auto-kill --auto-close --pulsate --text="Converting Images"

############################
exit 0
