from shutil import copyfile
import json
import sys
import os.path
import os
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


class ChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        build()


def main():
    if sys.argv.__len__() == 1:
        build()
    elif sys.argv[1] == "-watch":
        build()
        print "Watching"
        event_handler = ChangeHandler()
        observer = Observer()
        observer.schedule(event_handler, path='src/', recursive=True)
        observer.start()
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            observer.stop()
        observer.join()
    else:
        print "Invalid Arg"
        sys.exit()


cssconfig = ""

def build():
    try:
        config = json.load(open('Build.json'))
    except:
        print "Build.json Not Found"
        sys.exit()

    try:
        bundles = config['bundle']
    except:
        bundles = {}
        print "Bundle Config Not Found, Continuing"

    try:
        transfers = config['transfer']
    except:
        transfers = {}
        print "Transfer Config Not Found, Continuing"

    try:
        global cssconfig
        cssconfig = config['options']['cssconfig']
    except:
        print "No CSS Config Found, Continuing"

    try: 
        skipConfig = config['skip']
        skip = []
        for i in skipConfig:
            skip += genPathList(i)
    except:
        print "Skip Config Not Found, No Files Will Be Skipped, Continuing"
        skip = []
        

    for folder in bundles:
        try:
            print "Bundling: " + folder + " => " + bundles[folder]
            bundle(folder, bundles[folder])        
        except:
            print "Invalid Bundle On: " + folder + " => " + bundles[folder]
            sys.exit()

    for folder in transfers:
        try:
            print "Transfering: " + folder + " => " + transfers[folder]
            transfer(folder, transfers[folder])
        except:
            print "Invalid Transfer On: " + folder + " => " + transfers[folder]
            sys.exit()

    print "Done."



def genPathList(path):
    if not os.path.isdir(path):
        return [path]
    
    retVal = []
    for i in os.listdir(path):
        retVal += genPathList(path + "/" + i)

    return retVal

def initDestPath(path):
    if not os.path.exists(os.path.dirname(path)):
        os.makedirs(os.path.dirname(path))
    
    if os.path.isfile(path):
        os.remove(path)

def bundle(src, dest):
    files = genPathList(src)
    initDestPath(dest)
    destfile = open(dest, "w+")
    if dest.endswith(".html"):
        bundleHTML(files, destfile)
    elif dest.endswith('.js'):
        bundleJS(files, destfile)
    elif dest.endswith('.css'):
        bundleCSS(files, destfile)
    elif dest.endswith('.php'):
        bundlePHP(files, destfile)
    else:
        print "Unsupported Bundle For: " + dest + " Type" 
        raise Exception("Unsupported File Type")

    destfile.close()

def bundlePHP(files, destfile):
    for i in files:
        srcfile = open(i)
        validLine = True
        for line in iter(srcfile):
            if "//BLOCK-SKIP" in line:
                validLine = False

            if "//BLOCK-CONTINUE" in line:
                validLine = True
                continue

            if validLine: destfile.write(line)
        destfile.write("\n")
        srcfile.close()

def bundleHTML(files, destfile):
    for i in files:
        if not i.endswith(".html"): continue
        srcfile = open(i)
        validLine = True
        for line in iter(srcfile):
            if "<!--INCLUDE" in line:
                incFile = line.split()[1]
                bundleHTML(genPathList(incFile), destfile)
                continue

            if "<!--BLOCK-SKIP-->" in line:
                validLine = False

            if "<!--BLOCK-CONTINUE-->" in line:
                validLine = True
                continue

            if "<!--COMMENT-SKIP" in line or "COMMENT-CONTINUE-->" in line:
                continue

            if validLine: destfile.write(line)
        destfile.write("\n")
        srcfile.close()

def bundleJS(files, destfile):
    for i in files:
        if not i.endswith('.js'): continue
        srcfile = open(i)
        for line in iter(srcfile):
            destfile.write(line)
        destfile.write("\n")
        srcfile.close()


def bundleCSS(files, destfile):
    useconfig = cssconfig != ""
    cssconfigmap = {}
    if useconfig:
        cssconfigfile = open(cssconfig)
        for line in iter(cssconfigfile):
            if "=" in line:
                splitline = line.split()
                cssconfigmap[splitline[0]] = splitline[2]

    for i in files:
        if not i.endswith('.css'): continue
        srcfile = open(i)
        for line in iter(srcfile):
            if useconfig:
                for key, value in cssconfigmap.iteritems():
                    if key in line: 
                        line = line.replace(key, value)
            destfile.write(line)
        destfile.write("\n")
        srcfile.close()

def transfer(src, dest):
    files = genPathList(src)
    for i in files:
        destpath = dest + i.replace(src, "")
        initDestPath(destpath)
        copyfile(i, destpath)

if __name__ == "__main__":
    main()