text-adventure-js
=================

A JavaScript implementation of the Tiny Text Adventure engine

Project Creation and Setup
==========================

This project was created with [phonegap](http://www.phonegap.com). [phonegap](http://www.phonegap.com) itself is installed with [nodejs](http://nodejs.org/) and [npm](https://npmjs.org/). The version selected by the install tools below was 3.1.0-0.15.0. I used the following commands on Ubuntu 13.10:

sudo apt-get install node-js
cd ~/bin && ln -s /usr/bin/nodejs node
sudo apt-get install npm
sudo npm install -g phonegap
sudo npm install jasmine-node -g

To create a [phonegap](http://www.phonegap.com) project I did this

 phonegap create text-adventure-js com.chewielouie.textadventure "Tiny Text Adventure"

Android platform was installed with this command which installs the platform config and skeleton and builds the android app.

 phonegap local build android

Unit Testing and Build Tools
============================

I also will be installing [grunt](http://gruntjs.com/) for automated task execution:

 sudo npm install grunt
 sudo npm install grunt-jasmine-runner

[PhantomJS](http://www.phantomjs.org) is required for headless (without a browser) JavaScript execution. Download it from the website and install the executable in your path. I put mine in ~/bin.

To run the specs in a browser instead of using [PhantomJS](http://www.phantomjs.org) for headless, just load the www/spec.html page in Chrome.


