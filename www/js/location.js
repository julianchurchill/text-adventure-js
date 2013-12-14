/*global module, exports*/

(function () {
    "use strict";

    function Location(properties) {
        this.properties = properties;
    }

    Location.prototype.description = function() {
        return this.properties.description;
    };

    Location.prototype.exits = function() {
        return this.properties.exits;
    };

    Location.prototype.items = function() {
        return this.properties.items;
    };

    Location.prototype.actions = function() {
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
