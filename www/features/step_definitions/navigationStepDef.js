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
            this.visit('http://localhost:3000/test.html', callback);
        });

        this.When(/^I click the exit 'Library'$/, function (callback) {
            this.clickExit( 'Library', callback );
        });

        this.Then(/^the current location description changes to 'Library description'$/, function (callback) {
            this.assertDescriptionIs( 'Library description', callback );
        });
    };

    module.exports = navigationStepDefsWrapper;
})();
