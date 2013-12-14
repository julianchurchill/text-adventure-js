/*global */

(function () {
    "use strict";

    describe('TextAdventureModel', function() {
        var Location = require('../js/location.js');
        var Model = require('../js/model.js');
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
