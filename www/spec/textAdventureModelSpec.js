/*global jasmine*/

(function () {
    "use strict";

    describe('TextAdventureModel', function() {
        var Location = require('../js/location.js');
        var Model = require('../js/model.js');
        var model;

        beforeEach(function() {
            model = new Model();
        });

        it('new locations have an empty description', function() {
            expect( new Location().description() ).toEqual( '' );
        });

        it('new locations have an empty list of exits', function() {
            expect( new Location().exits() ).toEqual( [] );
        });

        it('new locations have an empty list of items', function() {
            expect( new Location().items() ).toEqual( [] );
        });

        it('new locations have an empty list of actions', function() {
            expect( new Location().actions() ).toEqual( [] );
        });

        it('current description is current location description', function() {
            model.setCurrentLocation( new Location( { description: 'location description' } ) );

            expect( model.currentDescription()).toBe( 'location description' );
        });

        it('current exits are current location exits', function() {
            var exits = [ { id: 'exit1', label: 'label1' } ];
            model.setCurrentLocation( new Location( { exits: exits } ) );

            expect( model.currentExits()).toEqual( exits );
        });

        it('current exits excludes invisible exits from current location', function() {
            var visible_exit = { id: 'exit1', label: 'label1', is_not_visible: "False" };
            var invisible_exit = { id: 'exit2', label: 'label2', is_not_visible: "True" };
            var all_exits = [ visible_exit, invisible_exit ];

            model.setCurrentLocation( new Location( { exits: all_exits } ) );

            expect( model.currentExits()).toEqual( [ visible_exit ] );
        });


        it('current items are current location items', function() {
            var items = [ { id: 'item1', label: 'label1' } ];
            model.setCurrentLocation( new Location( { items: items } ) );

            expect( model.currentItems()).toEqual( items );
        });

        it('current items excludes invisible items from current location', function() {
            var visible_item = { id: 'item1', label: 'label1', visibility: "visible" };
            var invisible_item = { id: 'item2', label: 'label2', visibility: "invisible" };
            var all_items = [ visible_item, invisible_item ];

            model.setCurrentLocation( new Location( { items: all_items } ) );

            expect( model.currentItems()).toEqual( [ visible_item ] );
        });

        it('current actions are current location actions', function() {
            var actions = [ { id: 'action1', label: 'label1' } ];
            model.setCurrentLocation( new Location( { actions: actions } ) );

            expect( model.currentActions()).toEqual( actions );
        });

        it('triggering an exit changes the current location', function() {
            var location2 = { description: 'location2 description', id: 'location2' };
            var location1 = { exits: [ { id: 'door1', destinationid: 'location2' } ] };
            model.loadModelFromJSON( { locations: [ location1, location2 ] } );

            model.exitTriggered( 'door1' );

            expect( model.currentLocation.id() ).toBe( 'location2' );
        });

        describe('sends events to subscriber', function() {
            var subscriber;

            beforeEach(function() {
                subscriber = jasmine.createSpyObj('subscriber', ['descriptionChanged',
                                                                 'exitsChanged',
                                                                 'itemsChanged',
                                                                 'actionsChanged']);
                model.subscribe( subscriber );
            });

            describe('on set current location', function() {
                it('description changed event', function() {
                    var new_location = new Location( { description: 'new description' } );
                    model.setCurrentLocation( new_location );

                    expect(subscriber.descriptionChanged).toHaveBeenCalledWith( 'new description' );
                });

                it('exits changed event', function() {
                    var new_exits = [{ id: 'exit1' }, { id: 'exit2' }];
                    var new_location = new Location( { exits: new_exits } );
                    model.setCurrentLocation( new_location );

                    expect(subscriber.exitsChanged).toHaveBeenCalledWith( new_exits );
                });

                it('items changed event', function() {
                    var new_items = [{ id: 'item1' }, { id: 'item2' }];
                    var new_location = new Location( { items: new_items } );
                    model.setCurrentLocation( new_location );

                    expect(subscriber.itemsChanged).toHaveBeenCalledWith( new_items );
                });

                it('actions changed event', function() {
                    var new_actions = [{ id: 'action1' }, { id: 'action2' }];
                    var new_location = new Location( { actions: new_actions } );
                    model.setCurrentLocation( new_location );

                    expect(subscriber.actionsChanged).toHaveBeenCalledWith( new_actions );
                });
            });

            describe('on exit triggered', function() {
                it('description changed event', function() {
                    var location2 = { description: 'new description', id: 'location2' };
                    var location1 = { exits: [ { id: 'door1', destinationid: 'location2' } ] };
                    model.loadModelFromJSON( { locations: [ location1, location2 ] } );

                    model.exitTriggered( 'door1' );

                    expect(subscriber.descriptionChanged).toHaveBeenCalledWith( 'new description' );
                });

                it('exits changed event', function() {
                    var new_exits = [{ id: 'exit1' }, { id: 'exit2' }];
                    var location2 = { exits: new_exits, id: 'location2' };
                    var location1 = { exits: [ { id: 'door1', destinationid: 'location2' } ] };
                    model.loadModelFromJSON( { locations: [ location1, location2 ] } );

                    model.exitTriggered( 'door1' );

                    expect(subscriber.exitsChanged).toHaveBeenCalledWith( new_exits );
                });

                it('items changed event', function() {
                    var new_items = [{ id: 'item1' }, { id: 'item2' }];
                    var location2 = { items: new_items, id: 'location2' };
                    var location1 = { exits: [ { id: 'door1', destinationid: 'location2' } ] };
                    model.loadModelFromJSON( { locations: [ location1, location2 ] } );

                    model.exitTriggered( 'door1' );

                    expect(subscriber.itemsChanged).toHaveBeenCalledWith( new_items );
                });

                it('actions changed event', function() {
                    var new_actions = [{ id: 'action1' }, { id: 'action2' }];
                    var location2 = { actions: new_actions, id: 'location2' };
                    var location1 = { exits: [ { id: 'door1', destinationid: 'location2' } ] };
                    model.loadModelFromJSON( { locations: [ location1, location2 ] } );

                    model.exitTriggered( 'door1' );

                    expect(subscriber.actionsChanged).toHaveBeenCalledWith( new_actions );
                });
            });
        });
    });

}());
