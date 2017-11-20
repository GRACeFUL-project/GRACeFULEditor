#!/bin/bash
cd /
cd gitEditor
#git checkout loadGCM
#git pull origin loadGCM
git pull origin master
cd /
cd webapp
cp -rd /gitEditor/version2/*  ./
#cp /webapp/libraries/*.* gitGrace/libraries/
ls -la libraries/


