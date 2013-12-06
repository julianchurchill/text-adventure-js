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

    describe('TextAdventureModel', function() {
        var model;

        beforeEach(function() {
            model = new Model();
        });

        it('current description is current location description', function() {
            model.setCurrentLocation( new Location( { description: 'location description' } ) );

            expect( model.currentDescription()).toBe( 'location description' );
        });

        it('current exits are current location exits', function() {
            var exits = [ { id: 'exit1', label: 'label1' } ];
            model.setCurrentLocation( new Location( { exits: exits } ) );

            expect( model.currentExits()).toBe( exits );
        });

        it('current items are current location items', function() {
            var items = [ { id: 'item1', label: 'label1' } ];
            model.setCurrentLocation( new Location( { items: items } ) );

            expect( model.currentItems()).toBe( items );
        });

        it('current actions are current location actions', function() {
            var actions = [ { id: 'action1', label: 'label1' } ];
            model.setCurrentLocation( new Location( { actions: actions } ) );

            expect( model.currentActions()).toBe( actions );
        });

        it('triggering an exit changes the current location', function() {
            var location2 = new Location( { description: 'location2 description' } );
            var location1 = new Location( { exits: [ { id: 'door1', destination: location2 } ] } );
            model.setCurrentLocation( location1 );

            model.exitTriggered( 'door1' );

            expect( model.currentLocation ).toBe( location2 );
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
