/*global module, exports*/

(function () {
    "use strict";

    function Location(properties) {
        this.properties = properties;
        if( this.properties === undefined )
            this.properties = {};
    }

    Location.prototype.id = function() {
        return this.properties.id;
    };

    Location.prototype.description = function() {
        if( this.properties.description === undefined )
            this.properties.description = '';
        return this.properties.description;
    };

    Location.prototype.visibleExits = function() {
        return this.exits().filter( function( thing ) {
            return thing.is_not_visible === undefined || thing.is_not_visible !== "True";
        });
    };

    Location.prototype.exits = function() {
        if( this.properties.exits === undefined )
            this.properties.exits = [];
        return this.properties.exits;
    };

    Location.prototype.visibleItems = function() {
        return this.items().filter( function( item ) {
            return item.visibility === undefined || item.visibility !== "invisible";
        } );
    };

    Location.prototype.items = function() {
        if( this.properties.items === undefined )
            this.properties.items = [];
        return this.properties.items;
    };

    Location.prototype.actions = function() {
        if( this.properties.actions === undefined )
            this.properties.actions = [];
        return this.properties.actions;
    };

    Location.prototype.getLocationIDForExit = function(exitid) {
        for (var i = 0; i < this.exits().length; i++) {
            if( this.exits()[i].id === exitid )
                return this.exits()[i].destinationid;
        }
        return undefined;
    };

    module.exports = Location;
}());
