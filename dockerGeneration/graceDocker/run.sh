#!/bin/sh

# this script is called when the docker image is started 

export PATH="/mznBin:/:$PATH"
export MZN_STDLIB_DIR=/mznSrc/MiniZincIDE-2.1.0-bundle-linux-x86_64/share/minizinc

cd /
mkdir webapp

#1] update the editor src
echo "Updating Editor"
/updateEditor.sh
echo "Updating Editor ... Done"

#2] update the Libraries which may be new
#echo "Updating GraceFul Libraries"
#/updateLibs.sh
#echo "Updating GraceFul... Done"

#3] Start the restAPI 
echo "Starting Server with GraceServer"
cd /gitGrace
git pull
echo "update grace server sources"
echo "********** ADDING NEW LIBS ***********************"
cp /webapp/libraries/*.* ./libraries/
ls -la libraries/

stack build
echo "stack build should be complete"
echo "Startin grace server"
stack exec GRACeServer
echo "This should no be visible"