/*global module, exports*/

(function () {
    "use strict";

    var Location = require('./location.js');

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

    Model.prototype.loadModelFromJSON = function(model_json) {
        this.locations = [];
        for (var i = 0; i < model_json.locations.length; i++)
            this.locations.push( new Location( model_json.locations[i] ) );
        if( this.locations.length > 0 )
            this.setCurrentLocation( this.locations[0] );
    }

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
        return this.currentLocation.visibleExits();
    };

    Model.prototype.currentItems = function() {
        return this.currentLocation.visibleItems();
    };

    Model.prototype.currentActions = function() {
        return this.currentLocation.actions();
    };

    module.exports = Model;
}());
