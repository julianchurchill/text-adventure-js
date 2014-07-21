#!/bin/bash

# Debian based systems have mawk, which needs extra arguments to produce unbuffered output
#AWK='mawk -Winteractive'
AWK='gawk'

UNLIMITED_STACK_FRAMES=0
if [ "$1" == "--full-backtrace" ]
then
    UNLIMITED_STACK_FRAMES=1
fi

$AWK '
BEGIN {
    currentsAts=0;
    maxStackFrames=4;
    unlimitedStackFrames='$UNLIMITED_STACK_FRAMES';
}
{
    if( unlimitedStackFrames == 1 ) {
        print $0;
    }
    else if( $0 ~ / at / ) {
        currentAts++;
        if( currentAts <= maxStackFrames ) {
            print $0;
        }
    } else {
        if( currentAts > 0 ) {
            currentAts=0;
            print "    ....backtrace truncated, only showing deepest " maxStackFrames " stack frames...."
            print "    ....to see full backtrace rerun with --full-backtrace...."
        }
        print $0;
    }
}
'


