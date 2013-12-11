/*global module*/

(function () {
    "use strict";

    var navigationStepDefsWrapper = function () {
        this.World = require("../support/world.js").World;
        var servedir = require("servedir");

        this.Before(function(callback) {
            this.server = servedir('www', 3000, { quiet: true });
            callback();
        });

        this.After(function(callback) {
            this.server.close();
            callback();
        });

        this.Given(/^a location with an exit labelled 'Library' that goes to the library$/, function(callback) {
            this.visit('http://localhost:3000', callback);
            // var html = '<html><script file="blah"></script></html>';
            // this.loadHTML(html, callback);
            // callback.pending();
        });

        this.When(/^I click the exit 'Library'$/, function (callback) {
            callback.pending();
        });

        this.Then(/^the current location changes to the library$/, function (callback) {
            callback.pending();
        });
    };

    module.exports = navigationStepDefsWrapper;
})();
