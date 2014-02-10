#!/bin/bash

trap ctrl_c INT

ctrl_c() {
    rm ${watchFile}
    exit 0
}

run_command() {
    touch -t `date +%m%d%H%M.%S` ${watchFile};
    echo "Running '${command}'";
    eval ${command}
}

usage() {
    echo "Usage: watchAndRun.sh [--ignore <filename>] <check period in seconds> <command to run on change> <list of directories to watch for changes>";
    echo " e.g. watchAndRun.sh 5 \"echo 'yes'\" src . .."
    exit 1;
}

# Arg one and two might be --ignore <filename>
if [ "$1" == "--ignore" -a "$2" == "" ]; then
    usage
fi
ignore_file_command=""
if [ "$1" == "--ignore" ]; then
    ignore_file="$2"
    ignore_file_command="! -name ${ignore_file}"
    shift; shift; # remove switch and argument
fi

# Arg one is delay in seconds between checking for changes
# Arg two is command to run on change detected
# Arg three* is list of directories to watch for changes

if [ "$1" == "" -o "$2" == "" -o "$3" == "" ]; then
    usage
fi

delay=$1
command="$2"
directory_list=

shift; shift; # Remove first two args to leave $@ containing only directories
while (( "$#" )); do
    directory_list="${directory_list} $1"
    shift
done

parentPID=`ps -fp $$ | tail -1 | awk '{print $3}'`
watchFile=/tmp/watch${parentPID}

while [ 1 ]; do

    if [ ! -e ${watchFile} ]; then
        echo "Created watch timestamp file '${watchFile}'"
        run_command
        echo "Waiting for changes (ignoring *.tmp *.class ${ignore_file})..."
    fi

    if [ `find ${directory_list} -type f -newer ${watchFile}  ! -iname *.tmp ! -iname *.class ${ignore_file_command} | wc -l` != "0" ]; then
        echo "*** Found changes: "
        echo `find ${directory_list} -type f -newer ${watchFile} ! -iname *.tmp ! -iname *.class ${ignore_file_command}`
        run_command
        echo "Waiting for changes (ignoring *.tmp *.class ${ignore_file})..."
    fi

    # echo "Sleeping for $delay seconds"
    sleep ${delay}
done

