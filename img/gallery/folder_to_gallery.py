#!/usr/bin/env python
import os
import sys
import json
import logging
from PIL import Image

MAX_WIDTH = 1024
MAX_HEIGHT = 768
MAX_THUMB_WIDTH = 380
MAX_THUMB_HEIGHT = 380


def convert(src, dst, size):
    width, height = size
    with Image.open(src) as img:
        original_width, original_height = img.size
        ratio = max(float(width) / original_width,
                    float(height) / original_height)
        new_width = int(round(original_width * ratio))
        new_height = int(round(original_height * ratio))
        if new_width < original_width and new_height < original_height:
            img = img.resize((new_width, new_height), Image.ANTIALIAS)
        with open(dst, 'wb') as dst_f:
            img.save(dst_f, 'JPEG')


def normalize_file_names(path):
    for fname in os.listdir(path):
        fpath = os.path.join(path, fname)
        
        if os.path.isfile(fpath) and fname.lower().endswith('.jpg'):
            if ' ' in fname and os.path.isfile(fname):
                fname = fname.replace(' ', '_')
                fpath_new = os.path.join(path, fname)
                os.rename(fpath, fpath_new)
            
            yield fname


def make_gallery(path):
    gallery_dir = os.path.basename(path.rstrip(os.path.sep))
    gallery_name = gallery_dir.replace('_', ' ').replace('-', ' ').title()
    json_file_path = os.path.join(path, 'gallery.json')
    thumb_folder_path = os.path.join(path, 'thumbs')
    
    if not os.path.isdir(thumb_folder_path):
        os.mkdir(thumb_folder_path)
    
    images = list(normalize_file_names(path))
    
    if not images:
        # We have nothig to do
        return

    for fname in images:
        fpath = os.path.join(path, fname)
        thumb_path = os.path.join(thumb_folder_path, fname)

        convert(fpath, thumb_path, (MAX_THUMB_WIDTH, MAX_THUMB_HEIGHT))
    
    with open(json_file_path, 'w') as json_file:
        json.dump(
            {
                gallery_dir: {
                    'title': gallery_name,
                    'pictures': images,
                },
            },
            json_file,
            ensure_ascii=False,
            indent=2,
        )
    


def main():
    folders = sys.argv[1:]
    if not folders:
        folders = [os.getcwd()]

    for folder in folders:
        if os.path.isdir(folder):
            make_gallery(folder)


if __name__ == '__main__':
    main()
