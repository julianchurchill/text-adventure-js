text-adventure-js
=================

A JavaScript implementation of the Tiny Text Adventure engine

Project Creation and Setup
==========================

This project was created with phonegap (http://www.phonegap.com). phonegap itself is installed with nodejs and npm. The version selected by the install tools below was 3.1.0-0.15.0. I used the following commands on Ubuntu 13.10:

sudo apt-get install node-js
cd ~/bin && ln -s /usr/bin/nodejs node
sudo apt-get install npm
sudo npm install -g phonegap
sudo npm install jasmine-node -g

To create a phonegap project I did this

 phonegap create text-adventure-js com.chewielouie.textadventure "Tiny Text Adventure"

Android platform was installed with this command which installs the platform config and skeleton and builds the android app.

 phonegap local build android


