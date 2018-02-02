from shutil import copyfile
import os
import shutil
import Bundle

'''
Bundles js files using Bundle.py
Copies all required files into Build folder
Builds Index.html
'''

cDir = os.getcwd()
filesToIgnore = ['BatchThumbGen.py', 'Bundle.pyc', 'package.json', 'javascript.js', 'jquery-3.2.1.min.js', 'velocity.min.js', '.gitignore', 'Build.py', 'Bundle.py']
folderToIgnore = [cDir + "/Images/GallerySKIP", cDir + "/.git", cDir + "/Build", cDir + "/js/objects"]

print " "
print "---------BUILDING PRODUCTION BUILD-----------"

if os.path.exists('Build'):
    shutil.rmtree('Build', ignore_errors=False, onerror=None)
os.makedirs('Build')

def genFolderList(path):
    initDir = os.listdir(path)
    retVal = []
    for i in initDir:
        folder = path + "/" + i
        if folder in folderToIgnore:
            continue
        if os.path.isdir(folder):
            retVal.append(folder)
            retVal.extend(genFolderList(folder))
    return retVal

def genFileList():
    folders = genFolderList(cDir)
    folders.append(cDir)
    retVal = []
    for i in folders:
        f = os.listdir(i)
        for j in f:
            cFile = i + "/" + j
            if os.path.isdir(cFile) or j in filesToIgnore :
                continue
            retVal.append(cFile)
    return retVal

def appendBuild(array):
    retVal = []
    for i in array:
        shortPath = i[len(cDir)+1:len(i)]
        retVal.append(cDir + "/Build/" + shortPath)
    return retVal


def buildIndex(source, destination):
    fOrg = open(source)
    fDes = open(destination, 'w+')
    useLine = True
    for line in iter(fOrg):
        if "<!--SKIP-->" in line:
            useLine = False
        elif "<!--CONTINUE-->" in line:
            useLine = True
            continue
        if "<!--SKIP-SINGLE" in line or "CONTINUE-SINGLE-->" in line:
            continue
        if useLine:
            fDes.write(line)
    fOrg.close()
    fDes.close()
    print destination + "  Index built"

folders = appendBuild(genFolderList(cDir))
files = appendBuild(genFileList())
filesOrg = genFileList()


print folders
print ""
print files
print ""

for i in folders:
    print i + " Folder Created"
    os.makedirs(i)

print ""

for i in range(0, len(files)):
    if "index.html" in files[i]:
        buildIndex(filesOrg[i], files[i])
        continue 

    print files[i] + " File copied"
    copyfile(filesOrg[i], files[i])
os.remove("Bundle.pyc")

print " "
print "--------BUILD COMPLETE------------"


