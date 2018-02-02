import os
import sys
from PIL import Image

#Generates a lower resolution and square thumbnail for gallery images
#Args-
# oldFolder newFolder size

if len(sys.argv) < 4:
    print "Please supply the proper arguements <Old Folder> <New Folder> <Size>"
    sys.exit()

initFolder = sys.argv[1]
thumbFolder = sys.argv[2]
size = sys.argv[3]

if not os.path.exists(initFolder):
    print "Init foler does not exist. Exiting."
    sys.exit()

if not os.path.exists(thumbFolder):
    print "Destination folder does not exist, creating..."
    os.makedirs(thumbFolder)

def genThumbnail(path, newPath):
    im = Image.open(path);
    width = im.size[0]
    height = im.size[1]

    cropSize = width
    if height < width:  #Landscape Images
        cropSize = height
        left = (width - height) / 2
        right = left + cropSize
        cropBox = (left,0,right,cropSize)
    else:               #Portrait Images
        cropBox = (0,0,cropSize,cropSize)

    crop = im.crop(cropBox)
    thumbSize = (int(size), int(size))
    crop.thumbnail(thumbSize)
    print "Saving " + path + " as " + newPath
    crop.save(newPath, im.format)
    im.close()
    crop.close()

def genThumbs(path):
    files = os.listdir(path)
    for i in files:
        oldPath = initFolder + "/" + i
        newPath = thumbFolder + "/thumb-" + i
        genThumbnail(oldPath, newPath)


genThumbs(initFolder)

