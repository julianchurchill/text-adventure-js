/*global module*/

(function () {
    "use strict";

    var navigationStepDefsWrapper = function () {
        this.World = require("../support/world.js").World;

        this.Given(/^a location with an exit labelled 'Library' that goes to the library$/, function(callback) {
            // callback.fail(new Error("Test failure"));
            callback.pending();
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
