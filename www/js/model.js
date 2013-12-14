/*global module, exports*/

(function () {
    "use strict";

    function Model() {
    }

    Model.prototype.subscribe = function(subscriber) {
    };

    Model.prototype.setCurrentLocation = function(location) {
        this.currentLocation = location;
    };

    Model.prototype.exitTriggered = function(exitid) {
        this.currentLocation = this.currentLocation.getLocationForExit( exitid );
    };

    Model.prototype.currentDescription = function() {
        return this.currentLocation.description();
    };

    Model.prototype.currentExits = function() {
        return this.currentLocation.exits();
    };

    Model.prototype.currentItems = function() {
        return this.currentLocation.items();
    };

    Model.prototype.currentActions = function() {
        return this.currentLocation.actions();
    };

    module.exports = Model;
}());
