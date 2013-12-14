/*global module*/

(function () {
    "use strict";

    var navigationStepDefsWrapper = function () {
        this.World = require("../support/world.js").World;
        var servedir = require("servedir");
        var httpRootDirectory = 'www';

        this.Before(function(callback) {
            this.server = servedir(httpRootDirectory, 3000, { quiet: true });
            callback();
        });

        this.After(function(callback) {
            this.server.close();
            callback();
        });

        this.Given(/^a location with an exit labelled 'Library' that goes to the library$/, function(callback) {
            // this.visit('http://localhost:3000/test.html', callback);
            callback.pending();
        });

        this.When(/^I click the exit 'Library'$/, function (callback) {
            // *** This is a test to see if we can assert something about the web page
            // if( this.browser.text('title') !== 'Hello World')
            //     callback.fail(new Error('Title is not Hello World'));
            // else
            //     callback();

            callback.pending();
        });

        this.Then(/^the current location changes to the library$/, function (callback) {
            callback.pending();
        });
    };

    module.exports = navigationStepDefsWrapper;
})();
