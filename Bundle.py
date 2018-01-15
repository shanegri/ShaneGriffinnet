import os.path
import os

'''
Bundles all .js files in the js folder into a single file
'''
currentDir =  os.getcwd()
sourcePath = currentDir + "/js"
destinationPath = currentDir + "/js/js-bundled.js"
filesToIgnore = ["jquery-3.2.1.min.js", "velocity.min.js", "js-bundled.js"];

print "--------BUNDLING JS FILES----------"
print ""

def genFileList(path):
    initDir = os.listdir(path)
    retVal = []
    for i in initDir:
        if i in filesToIgnore:
            continue
        if(os.path.isdir(path + "/" + i)):
            retVal.extend(genFileList(path + "/" + i))
        else:
            retVal.append(path + "/" + i)
    return retVal


def appendToFile(fileToAppendTo, stuffPathToAppend):
    print "Writing file " + stuffPathToAppend
    f2 = open(stuffPathToAppend)
    useLine = True;
    for line in iter(f2):
        if "///SKIP" in line:
            useLine = False
        elif "///CONTINUE" in line:
            useLine = True
            continue
        if useLine:
            fileToAppendTo.write(line)
    f2.close()

files = genFileList(sourcePath)

f = open(destinationPath, "w+")

for i in files:
        appendToFile(f, i)

f.close()

print " "
print "--------BUNDLE COMPLETE----------"

