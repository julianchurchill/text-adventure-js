text-adventure-js
=================

A JavaScript implementation of the Tiny Text Adventure engine

Quick Start (TLDR)
==================

Clone this repository. Then:

# Install nodejs, npm and phonegap to your development machine:

    sudo apt-get install node-js
    cd ~/bin && ln -s /usr/bin/nodejs node
    sudo apt-get install npm
    sudo npm install -g phonegap

# Download and install PhantomJS for headless Javascript unit test running:

    Download [PhantomJS](http://www.phantomjs.org) and install the executable in your path. I put mine in ~/bin.

# Run the unit tests from the code root directory:

    With jasmine-node    ./node_modules/.bin/jasmine-node www/spec
    With PhantomJS       phantomjs build/jasmine/run-jasmine-under-phantomjs.js www/spec.html

Project Creation and Setup
==========================

This project was created with [phonegap](http://www.phonegap.com). [phonegap](http://www.phonegap.com) itself is installed with [nodejs](http://nodejs.org/) and [npm](https://npmjs.org/). The version selected by the install tools below was 3.1.0-0.15.0. I used the following commands on Ubuntu 13.10:

    sudo apt-get install node-js
    cd ~/bin && ln -s /usr/bin/nodejs node
    sudo apt-get install npm
    sudo npm install -g phonegap

To create a [phonegap](http://www.phonegap.com) project I did this

    phonegap create text-adventure-js com.chewielouie.textadventure "Tiny Text Adventure"

Android platform was installed with this command which installs the platform config and skeleton and builds the android app.

    phonegap local build android

Unit Testing and Build Tools
============================

I installed [jasmine](http://pivotal.github.io/jasmine) for automated task execution. This is installed in the git repository in node_modules so you do not have to do it again. The command I used was:

    sudo npm install jasmine-node

To run the jasmine-node tests do this:

    ./node_modules/.bin/jasmine-node www/spec

I installed [jake](https://github.com/mde/jake) for automated task execution. This is installed in the git repository in node_modules so you do not have to do it again. The command I used was:

    sudo npm install jake

To see all available Jake tasks run 'jake -T'. The default task should lint, build and run the unit tests - just run 'jake'.

I installed [jshint]() for linting. This is installed in the git repository in node_modules so you do not have to do it again. The command I used was:

    sudo npm install jshint

[PhantomJS](http://www.phantomjs.org) is required for headless (without a browser) JavaScript execution. Download it from the website and install the executable in your path. I put mine in ~/bin. Use this line to run the specs from the code root directory:

    phantomjs build/jasmine/run-jasmine-under-phantomjs.js www/spec.html

To run the specs in a browser instead of using [PhantomJS](http://www.phantomjs.org) for headless, just load the www/spec.html page in Chrome.

Todo
====

- Use jasmine-node to run tests instead of PhantomJS. This runs them under node, giving 'require'.
- 'jake' will run lint but it fails due to not using 'use strict' in a function scope in helper.js and index.js. Making the function scope hides the global variables 'app' and 'helper' causing the tests to fail when run with phantomJS. How do I resolve both these issues?
    - Exclude these 'example tests and app' from the linting, use files.exclude() in Jakefile.js
- Use requirejs to manage inclusion of different js source files in each other or run the tests/jasmine under nodejs to get require built in.
- Consider upgrading to jasmine 2.0.0 so that pending() is available (or empty it() or xit, xdescribe() showing up as disabled in test results).
  - See www/spec.html
- Proposed test list:
  - View
    - DONE Should update description div when receiving a description changed event
    - DONE Should update items div when receiving an items changed event
        - Pluralisation of items (is, are)
        - Countable noun prefix (a, an, some)
        - Proper nouns (no pronoun - e.g. no 'a', 'an', 'some')
    - Should update exits div when receiving an exits changed event
        - DONE Update labels
        - Create user selectable links to trigger call back into presenter when selected
    - Should update actions div when receiving an actions changed event
        - Update labels
        - Create user selectable links to trigger call back into presenter when selected
  - Presenter
    - DONE on exit action tells the model to use the exit
    - on action tells model to enact the action
    -DONE Should send a changed event for description, exits, items and actions to view when told to render
    - Should return description for current location when sending a description changed event
    - Should return exits for current location when sending an exits changed event
    - Should return items for current location when sending an items changed event
    - Should return available actions when sending an actions changed event
    - Should append action results to description when sending a description changed event
  - Model
    - ... perhaps we should just let this evolve from the presenter tests...
