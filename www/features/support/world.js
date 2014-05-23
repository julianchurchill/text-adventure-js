/*global exports*/

(function () {
    "use strict";

    var Zombie = require('zombie');

    var World = function World(callback) {
        this.browser = new Zombie();
        // this.browser.debug = true;
        var fs = require('fs');
        var model_location = 'www/features/support/model.json';
        var model_has_been_set = false;

        this.clearModel = function() {
            if(model_has_been_set)
                fs.unlinkSync(model_location);
        };

        this.setModel = function( model_content, callback ) {
            model_has_been_set = true;
            fs.writeFileSync(model_location, JSON.stringify(model_content));

            // We must re-browserify cucumber_bootstrap since we've changed model.json
            var cuke_bootstrap_bundle = "www/features/support/cucumber_bootstrap_bundle.js";
            var cmds = [ './node_modules/.bin/browserify www/features/support/cucumber_bootstrap.js -o ' + cuke_bootstrap_bundle ];
            var jake = require('jake');
            jake.exec(cmds, {breakOnError: true, printStdout: true}, function () {
                callback();
            });
        };

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

        this.assertItemListIncludes = function(expected_item, callback) {
            if( this.browser.text('#items').indexOf( expected_item ) == -1 )
                callback.fail(new Error("Expected item '" + expected_item + "' was not found in '" + this.browser.text('#items') + "'"));
            else
                callback();
        };

        // last line to tell cucumber.js the World is ready and use world as this
        callback();
    };

    exports.World = World;
})();
