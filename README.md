# text-adventure-js

A JavaScript implementation of the Tiny Text Adventure engine

## Quick Start (TLDR)

Clone this repository. Then:

### Install nodejs, npm and phonegap to your development machine:

    sudo apt-get install node-js
    cd ~/bin && ln -s /usr/bin/nodejs node
    sudo apt-get install npm
    sudo npm install -g phonegap

### Download and install PhantomJS for headless Javascript unit test running:

    Download [PhantomJS](http://www.phantomjs.org) and install the executable in your path. I put mine in ~/bin.

### Build, lint and run tests:

    ./build/runJake.sh

### List available build tasks:

    ./build/runJake.sh -T

### Run the unit tests from the code root directory:

    With script          ./build/runJake.sh unit_tests
    With PhantomJS       phantomjs build/jasmine/run-jasmine-under-phantomjs.js www/spec.html

### Run the acceptance tests from the code root directory:

    ./build/runJake.sh acceptance_tests

### Run the work in progress acceptance tests from the code root directory:

    ./build/runJake.sh wip_acceptance_tests

### Automatically build and run tests when code changes:

    ./build/watchAndRun.sh --ignore cucumber_bootstrap_bundle.js 1 ./build/runJake.sh www

### Automatically build and run all tests including work in progress tests when code changes:

    ./build/watchAndRun.sh --ignore cucumber_bootstrap_bundle.js 1 "./build/runJake.sh wip" www

### To build the android app

    ./build/runJake.sh android

## Project Creation and Setup

This project was created with [phonegap](http://www.phonegap.com). [phonegap](http://www.phonegap.com) itself is installed with [nodejs](http://nodejs.org/) and [npm](https://npmjs.org/). The version selected by the install tools below was 3.1.0-0.15.0. I used the following commands on Ubuntu 13.10:

    sudo apt-get install node-js
    cd ~/bin && ln -s /usr/bin/nodejs node
    sudo apt-get install npm
    sudo npm install -g phonegap

To create a [phonegap](http://www.phonegap.com) project I did this

    phonegap create text-adventure-js com.chewielouie.textadventure "Tiny Text Adventure"

Android platform was installed with this command which installs the platform config and skeleton and builds the android app.

    phonegap local build android

For DOM manipulation I used JQuery. This is installed in the git repository in node_modules so you do not have to do it again. The command I used was:

    sudo npm install jquery

## Unit Testing and Build Tools

I installed [jasmine](http://pivotal.github.io/jasmine) for BDD style unit testing. This is installed in the git repository in node_modules so you do not have to do it again. The command I used was:

    sudo npm install jasmine-node

To run the jasmine-node tests do this:

    ./node_modules/.bin/jasmine-node www/spec

For unit testing the DOM manipulation through jasmine and JQuery I used jasmine-jquery. This is installed in the git repository in node_modules so you do not have to do it again. The command I used was:

    sudo npm install jasmine-jquery

Then I manually patched it to work for Node version numbers with more than one digit - https://github.com/dkastner/node-jasmine-jquery/commit/29d1ce9e2e7bf5abd105de00271ae4f1f4099269. This is needed until the npm package is updated beyond v1.3.3.

I installed [jake](https://github.com/mde/jake) for automated task execution. This is installed in the git repository in node_modules so you do not have to do it again. The command I used was:

    sudo npm install jake

I've added a local shell script to run the _local_ version of jake to avoid version clashes with globally installed jake. Use ./build/runJake.sh instead of 'jake'. To see all available Jake tasks run './build/runJake.sh -T'. The default task should lint, build and run the unit tests - just run './build/runJake.sh'.

I installed [jshint]() for linting. This is installed in the git repository in node_modules so you do not have to do it again. The command I used was:

    sudo npm install jshint

[PhantomJS](http://www.phantomjs.org) is required for headless (without a browser) JavaScript execution. Download it from the website and install the executable in your path. I put mine in ~/bin. Use this line to run the specs from the code root directory:

    phantomjs build/jasmine/run-jasmine-under-phantomjs.js www/spec.html

To run the specs in a browser instead of using [PhantomJS](http://www.phantomjs.org) for headless, just load the www/spec.html page in Chrome.

[Cucumber-js](http://github.com/cucumber/cucumber-js) is required for running Cucumber feature spec. I installed this in the git repository in node_modules so you do not have to do it again. The command I used was:

    sudo npm install cucumber

To run the specs type:

    ./node_modules/.bin/cucumber.js www/features -r www/features/step_definitions

[zombie](http://zombie.labnotes.org) is used for running Cucumber feature specs in a headless browser, similar to PhantomJS. I installed this in the git repository in node_modules so you do not have to do it again. The command I used was:

    sudo npm install zombie

[servedir](http://github.com/remy/servedir) is used for running a standalone web file server for use by the Cucumber tests. I installed this in the git repository in node_modules so you do not have to do it again. The command I used was:

    sudo npm install servedir

[browserify](http://browserify.org) is used to 'bundle' up javascript files, parsing 'require' and 'export' statements to allow these server-side features to be used in client side code. This is particularly useful for running a bootstrapped Cucumber test runner. I installed this in the git repository in node_modules so you do not have to do it again. The command I used was:

    sudo npm install browserify

## Todo

- User Stories/Cukes
  - Invisible items should not be visible in a location
  - Look at my inventory
  - Examine an item in my inventory
  - Use an item in my inventory with another item that does nothing
  - Use an item in my inventory with another item that does something {multiple tests here for actions a, b, c etc...}
  - Talk to an NPC
  - Save my game and restore it when I return
  - Start a new game
  - See the credits/contact info
  - See the walkthrough
  - See the quick hint
- Technical
  - Do we need a cucumber_bootstrap _and_ an app_bootstrap? Aren't they both just 'main' for the application?
    - How do we put 'model.json' in the right place for the cucumber tests if we combine the app and cuke bootstraps?
  - Shorten cuke failure backtrace
  - Consider upgrading to jasmine 2.0.0 so that pending() is available (or empty it() or xit, xdescribe() showing up as disabled in test results).
    - See www/spec.html
    - Can this be done with jasmine-node?
  - View
    - Write cuke tests to check items are shown
    - Should update actions div when receiving an actions changed event
      - Update labels
      - Create user selectable links to trigger call back into presenter when selected
  - Presenter
    - Should append action results to description when sending a description changed event
    - on action tells model to enact the action

## DONE

- Python script to convert from 'Android/Java' TTA model to JSON
- Browserify of cucumber_bootstrap.js failed giving a zero-size bundle file because view.js include jquery which browserify cannot handle. Remove use of jquery in view, use DOM API.
    - http://substack.net/weaning_yourself_off_jquery
- Mark work in progress cucumber features with @wip tag, to avoid running them with a default 'runJake.sh'. Run them with 'runJake.sh wip'.
- Use browserify to 'bundle' up our source that uses 'require' and 'export' into bundle.js. Import this into test.html for Cucumber tests, now see if they run...
  - http://browserify.org/
- Split source and tests for Model, Presenter and View. Use 'require' to include client code in the jasmine tests.
- View
  - Should update exits div when receiving an exits changed event
  - Should update description div when receiving a description changed event
  - Should update items div when receiving an items changed event
    - Pluralisation of items (is, are)
    - Countable noun prefix (a, an, some)
    - Proper nouns (no pronoun - e.g. no 'a', 'an', 'some')
- Presenter
  - on exit action tells the model to use the exit
  - Should send a changed event for description, exits, items and actions to view when told to render
  - Should return description for current location when sending a description changed event
  - Should return exits for current location when sending an exits changed event
  - Should return items for current location when sending an items changed event
  - Should return available actions when sending an actions changed event
- Model
  - Sends a changed event for description, exits, items and actions on set current location
  - Sends a changed event for description, exits, items and actions on exit triggered
  - Should return description, exits, items and actions for current location
  - On exit triggered change the current location to the new location
