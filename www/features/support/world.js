/*global exports*/

(function () {
    "use strict";

    var Zombie = require('zombie');

    var World = function World(callback) {
        this.browser = new Zombie();
        this.browser.debug = true;

        function checkForBrowserError(error, error_message_prefix, callback) {
            if(error !== undefined)
                callback.fail(new Error(error_message_prefix + " failed with error '" + error + "'"));
            else
                callback();
        }

        this.visit = function(url, visit_callback) {
            this.browser.visit(url, function(error, browser) {
                checkForBrowserError(error, "Visiting '" + url + "'", visit_callback);
            });
        };

        this.loadHTML = function(html, load_callback) {
            this.browser.load(html, function(error, browser) {
                checkForBrowserError(error, "Loading '" + html + "'", load_callback);
            });
        };

        this.clickExit = function(exit, clickExit_callback) {
            this.browser.clickLink(exit, function(error, browser) {
                checkForBrowserError(error, "Clicking exit link '" + exit + "'", clickExit_callback);
            });
        };

        this.assertDescriptionIs = function(expected_description, visit_callback) {
            if( this.browser.text('#description') !== expected_description )
                visit_callback.fail(new Error("Expected description was not '" + expected_description + "' it was '" + this.browser.text('#description') + "'"));
            else
                visit_callback();
        };

        // last line to tell cucumber.js the World is ready and use world as this
        callback();
    };

    exports.World = World;
})();
