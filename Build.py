from shutil import copyfile
import os
import shutil
import Bundle
import json

'''
Bundles js files using Bundle.py
Copies all required files into Build folder
Builds Index.html
'''

cDir = os.getcwd()

buildConfig = json.load(open('Build.json'))
filesToIgnore = buildConfig['filesToIgnore']
folderToIgnore = [cDir + folder for folder in buildConfig['folderToIgnore']]

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


def buildFile(source, destination):
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
    print destination + "  File built"

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
    buildFile(filesOrg[i], files[i])
    print files[i] + " File copied"
os.remove("Bundle.pyc")

print " "
print "--------BUILD COMPLETE------------"
