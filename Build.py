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
    for i in files:
        srcfile = open(i)
        appendFile(srcfile, destfile, i)
        srcfile.close()
    destfile.close()

def transfer(src, dest):
    files = genPathList(src)
    for i in files:
        destpath = dest + i.replace(src, "")
        initDestPath(destpath)
        copyfile(i, destpath)

def appendFile(srcfile, destfile, src):
    if src.endswith(".html"):
        appendFileHTML(srcfile, destfile)
    elif src.endswith('.js'):
        appendFileJS(srcfile, destfile)
    else:
        for line in iter(srcfile):
            destfile.write(line)

    destfile.write("\n")


def appendFileHTML(srcfile, destfile):
    validLine = True
    for line in iter(srcfile):
        if "<!--BLOCK-SKIP-->" in line:
            validLine = False

        if "<!--BLOCK-CONTINUE-->" in line:
            validLine = True
            continue

        if "<!--COMMENT-SKIP" in line or "COMMENT-CONTINUE-->" in line:
            continue

        if validLine: destfile.write(line)


def appendFileJS(srcfile, destfile):
    for line in iter(srcfile):
        destfile.write(line)


if __name__ == "__main__":
    main()