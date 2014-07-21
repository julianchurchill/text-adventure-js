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
            this.clearModel();
            this.server.close();
            callback();
        });

        // this.Given(/^a location with an action labelled '(.*)' has a '(.*)' item$/, function(action_label, item_label, callback) {
        //     callback();
        // });

        // this.When(/^I click the action '(.*)'$/, function(action_label, callback) {
        //     callback();
        // });

        // this.Then(/^the current location item list no longer includes '(.*)'$/, function(item_label, callback) {
        //     callback();
        // });

        // this.Then(/^the current location action list no longer includes '(.*)'$/, function(action_label, callback) {
        //     callback();
        // });

        function initializeModel( world, model_content, callback ) {
            world.setModel( model_content, function () {
                world.visit('http://localhost:3000/test.html', callback);
            });
        }

        this.Given(/^a location with an exit labelled '(.*)' that goes to (.*) with a description '(.*)'$/, function(exit_label, destination_id, destination_description, callback) {
            var test_model = {
                locations: [
                    { id: "first room", exits: [ { id: "Library", destinationid: destination_id, label: exit_label } ] },
                    { id: destination_id, description: destination_description }
                ]
            };
            initializeModel( this, test_model, callback );
        });


        this.Given(/^a location with an exit labelled '(.*)' that is invisible$/, function(exit_label, callback) {
            var test_model = {
                locations: [
                    { id: "first room", exits: [ { id: "exit1", destinationid: "exit1_destination_id", label: exit_label, is_not_visible: "True" } ] },
                ]
            };
            initializeModel( this, test_model, callback );
        });

        this.When(/^I click the exit '(.*)'$/, function (exit, callback) {
            this.clickExit( exit, callback );
        });

        this.Then(/^the current location description changes to '(.*)'$/, function (description, callback) {
            this.assertDescriptionIs( description, callback );
        });

        this.Given(/^a location has an item named '(.*)'$/, function(item_name, callback) {
            var test_model = {
                locations: [
                    { id: "location1", exits: [], items: [ { id: "item1", name: item_name } ] },
                ]
            };
            initializeModel( this, test_model, callback );
        });

        this.Given(/^a location has an item named '(.*)' that is invisible$/, function(item_name, callback) {
            var test_model = {
                locations: [
                    { id: "location1", exits: [], items: [ { id: "item1", name: item_name, visibility: "invisible" } ] },
                ]
            };
            initializeModel( this, test_model, callback );
        });

        this.When(/^I enter the location$/, function (callback) {
            callback();
        });

        this.Then(/^the current location item list includes '(.*)'$/, function (item_label, callback) {
            this.assertItemListIncludes( item_label, callback );
        });

        this.Then(/^the current location item list does not include '(.*)'$/, function (item_label, callback) {
            this.assertItemListDoesNotInclude( item_label, callback );
        });

        this.Then(/^the current location exit list does not include '(.*)'$/, function (exit_label, callback) {
            this.assertExitListDoesNotInclude( exit_label, callback );
        });
    };

    module.exports = navigationStepDefsWrapper;
})();
