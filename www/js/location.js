/*global module, exports*/

(function () {
    "use strict";

    function Location(properties) {
        this.properties = properties;
        if( this.properties === undefined )
            this.properties = {};
    }

    Location.prototype.description = function() {
        if( this.properties.description === undefined )
            this.properties.description = '';
        return this.properties.description;
    };

    Location.prototype.exits = function() {
        if( this.properties.exits === undefined )
            this.properties.exits = [];
        return this.properties.exits;
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

    Location.prototype.getLocationForExit = function(exitid) {
        for (var i = 0; i < this.exits().length; i++) {
            if( this.exits()[i].id === exitid )
                return this.exits()[i].destination;
        }
        return undefined;
    };

    module.exports = Location;
}());
