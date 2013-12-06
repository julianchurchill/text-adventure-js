/*global jasmine*/

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

    Location.prototype.getLocationForExit = function(exitid) {
        for (var i = 0; i < this.exits().length; i++) {
            if( this.exits()[i].id === exitid )
                return this.exits()[i].destination;
        }
        return undefined;
    };

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
        return [];
    };

    Model.prototype.currentActions = function() {
        return [];
    };

    describe('TextAdventureModel', function() {
        it('current description is current location description', function() {
            var location = new Location( { description: 'location description' } );
            var model = new Model();
            model.setCurrentLocation( location );

            expect( model.currentDescription()).toBe( 'location description' );
        });

        it('current exits are current location exits', function() {
            var exits = [ { id: 'exit1', label: 'label1' } ];
            var location = new Location( { exits: exits } );
            var model = new Model();
            model.setCurrentLocation( location );

            expect( model.currentExits()).toBe( exits );
        });

        // it('current items are current location items', function() {
        // it('current actions are current location actions', function() {

        it('triggering an exit changes the location description', function() {
            var location2 = new Location( { description: 'location2 description' } );
            var location1 = new Location( { exits: [ { id: 'door1', destination: location2 } ] } );
            var model = new Model();
            model.setCurrentLocation( location1 );

            model.exitTriggered( 'door1' );

            expect( model.currentDescription()).toBe( 'location2 description' );
        });

        // it('sends description changed event to subscribers', function() {
        // });
        // it('sends exits changed event to subscribers', function() {
        // });
        // it('sends items changed event to subscribers', function() {
        // });
        // it('sends actions changed event to subscribers', function() {
        // });
    });

}());
