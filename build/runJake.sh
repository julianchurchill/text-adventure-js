#!/bin/bash

FULL_BACKTRACE=""
if [ "$1" == "--full-backtrace" ]
then
    FULL_BACKTRACE="--full-backtrace"
    shift
fi

./node_modules/.bin/jake $@ | ./build/filterCrazyLongCukeBacktraces.sh $FULL_BACKTRACE
