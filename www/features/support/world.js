/*global exports*/

(function () {
    "use strict";

    var Zombie = require('zombie');

    var World = function World(callback) {
        this.browser = new Zombie();
        this.browser.debug = true;

        this.visit = function(url, visit_callback) {
            this.browser.visit(url, function(error, browser) {
                if(error !== undefined)
                    visit_callback.fail(new Error("Visiting '" + url + "' failed with error '" + error + "'"));
                else
                    visit_callback();
            });
        };

        this.loadHTML = function(html, load_callback) {
            this.browser.load(html, function(error, browser) {
                if(error !== undefined)
                    load_callback.fail(new Error("Loading '" + html + "' failed with error '" + error + "'"));
                else
                    load_callback();
            });
        };

        // last line to tell cucumber.js the World is ready and use world as this
        callback();
    };

    exports.World = World;
})();
