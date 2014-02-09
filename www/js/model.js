/*global module, exports*/

(function () {
    "use strict";

    function Model() {
        this.subscriber = undefined;
        this.locations = [];
    }

    Model.prototype.subscribe = function(subscriber) {
        this.subscriber = subscriber;
    };

    Model.prototype.setCurrentLocation = function(location) {
        this.currentLocation = location;
        if( this.subscriber !== undefined ) {
            this.subscriber.descriptionChanged( this.currentDescription() );
            this.subscriber.exitsChanged( this.currentExits() );
            this.subscriber.itemsChanged( this.currentItems() );
            this.subscriber.actionsChanged( this.currentActions() );
        }
    };

    Model.prototype.exitTriggered = function(exitid) {
        var newLocationID = this.currentLocation.getLocationIDForExit( exitid );
        this.setCurrentLocation( this.findLocationByID( newLocationID ) );
    };

    Model.prototype.addLocation = function(location) {
        this.locations.push( location );
    };

    Model.prototype.findLocationByID = function(locationid) {
        for (var i = 0; i < this.locations.length; i++) {
            if( this.locations[i].id() === locationid )
                return this.locations[i];
        }
        return undefined;
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
