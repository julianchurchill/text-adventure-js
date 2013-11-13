/*global jasmine*/

(function () {
    "use strict";

    function Model() {
    }

    Model.prototype.subscribe = function(subscriber) {
    };

    Model.prototype.exitTriggered = function(exitid) {
    };

    Model.prototype.currentDescription = function() {
        return '';
    };

    Model.prototype.currentExits = function() {
        return [];
    };

    Model.prototype.currentItems = function() {
        return [];
    };

    Model.prototype.currentActions = function() {
        return [];
    };

    // describe('TextAdventureModel', function() {
        // it('sends description changed event to subscribers', function() {
        // });
        // it('sends exits changed event to subscribers', function() {
        // });
        // it('sends items changed event to subscribers', function() {
        // });
        // it('sends actions changed event to subscribers', function() {
        // });
    // });

}());
