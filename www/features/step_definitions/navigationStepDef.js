/*global module*/

(function () {
    "use strict";

    var navigationStepDefsWrapper = function () {
        this.World = require("../support/world.js").World;
        var fs = require('fs');
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

        this.Given(/^a location with an exit labelled '(.*)' that goes to (.*) with a description '(.*)'$/, function(exit_label, destination_id, destination_description, callback) {
            var test_model = {
                locations: [
                    { id: "first room", exits: [ { id: "Library", destinationid: destination_id, label: exit_label } ] },
                    { id: destination_id, description: destination_description }
                ]
            };

            fs.writeFileSync('www/features/support/model.json', JSON.stringify(test_model));
            this.visit('http://localhost:3000/test.html', callback);
        });

        this.When(/^I click the exit '(.*)'$/, function (exit, callback) {
            this.clickExit( exit, callback );
        });

        this.Then(/^the current location description changes to '(.*)'$/, function (description, callback) {
            this.assertDescriptionIs( description, callback );
        });

        this.Given(/^a location has an item labelled '(.*)'$/, function(item_label, callback) {
            callback();
        });

        this.When(/^I enter the location$/, function (callback) {
            this.visit('http://localhost:3000/test.html', callback);
        });

        this.Then(/^the current location item list includes '(.*)'$/, function (item_label, callback) {
            this.assertItemListIncludes( item_label, callback );
        });
    };

    module.exports = navigationStepDefsWrapper;
})();
