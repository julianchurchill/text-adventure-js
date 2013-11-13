/*global jasmine*/

(function () {
    "use strict";

    function Presenter(model, view) {
        this.model = model;
        this.view = view;
        this.model.subscribe( this );
    }

    Presenter.prototype.exitTriggered = function(exitid) {
        this.model.exitTriggered( exitid );
    };

    Presenter.prototype.descriptionChanged = function(description) {
        this.view.onDescriptionChanged( this.model.currentDescription() );
    };

    Presenter.prototype.exitsChanged = function(description) {
        this.view.onExitsChanged( this.model.currentExits() );
    };

    Presenter.prototype.itemsChanged = function(description) {
        this.view.onItemsChanged( this.model.currentItems() );
    };

    Presenter.prototype.actionsChanged = function(description) {
        this.view.onActionsChanged( this.model.currentActions() );
    };

    Presenter.prototype.render = function() {
        this.view.onDescriptionChanged( this.model.currentDescription() );
        this.view.onExitsChanged( this.model.currentExits() );
        this.view.onItemsChanged( this.model.currentItems() );
        this.view.onActionsChanged( this.model.currentActions() );
    };

    function Model() {
    }

    Model.prototype.subscribe = function(subscriber) {
    };

    Model.prototype.exitTriggered = function(exitid) {
    };

    Model.prototype.currentDescription = function() {
        return '';
    };

    Model.prototype.currentExits = function() {
        return [];
    };

    Model.prototype.currentItems = function() {
        return [];
    };

    Model.prototype.currentActions = function() {
        return [];
    };

    describe('TextAdventurePresenter', function() {
        var model, my_view, presenter;

        beforeEach(function() {
            model = new Model();
            my_view = jasmine.createSpyObj('view', ['onDescriptionChanged',
                                                    'onExitsChanged',
                                                    'onItemsChanged',
                                                    'onActionsChanged']);
            presenter = new Presenter( model, my_view );
        });

        describe('on creation', function() {
            it('subscribes to model for events', function() {
                spyOn( model, 'subscribe' );

                var another_presenter = new Presenter( model, my_view );

                expect(model.subscribe).toHaveBeenCalledWith( another_presenter );
            });
        });

        describe('on exit action', function() {
            it('should tell model to use an exit', function() {
                spyOn( model, 'exitTriggered' );

                presenter.exitTriggered( 'exitid' );

                expect(model.exitTriggered).toHaveBeenCalledWith( 'exitid' );
            });
        });

        describe('on render', function() {
            it('should tell the view what the current location description is', function() {
                spyOn( model, 'currentDescription' ).andReturn( 'description' );

                presenter.render();

                expect(my_view.onDescriptionChanged).toHaveBeenCalledWith( 'description' );
            });

            it('should tell the view what the current exits are', function() {
                var exits = [{ label: 'exit1', id: 'exit1' }];
                spyOn( model, 'currentExits' ).andReturn( exits );

                presenter.render();

                expect(my_view.onExitsChanged).toHaveBeenCalledWith( exits );
            });

            it('should tell the view what the current items are', function() {
                var items = [{ label: 'item1', id: 'item1' }];
                spyOn( model, 'currentItems' ).andReturn( items );

                presenter.render();

                expect(my_view.onItemsChanged).toHaveBeenCalledWith( items );
            });

            it('should tell the view what the current available actions are', function() {
                var actions = [{ id: 'action1' }];
                spyOn( model, 'currentActions' ).andReturn( actions );

                presenter.render();

                expect(my_view.onActionsChanged).toHaveBeenCalledWith( actions );
            });
        });

        describe('on event from model', function() {
            describe('current location description changed', function() {
                it('should tell the view what the current location description is', function() {
                    spyOn( model, 'currentDescription' ).andReturn( 'description' );

                    presenter.descriptionChanged();

                    expect(my_view.onDescriptionChanged).toHaveBeenCalledWith( 'description' );
                });
            });

            describe('current location exits changed', function() {
                it('should tell the view what the current location exits are', function() {
                    var exits = [{ label: 'exit1', id: 'exit1' }];
                    spyOn( model, 'currentExits' ).andReturn( exits );

                    presenter.exitsChanged();

                    expect(my_view.onExitsChanged).toHaveBeenCalledWith( exits );
                });
            });

            describe('current location items changed', function() {
                it('should tell the view what the current location items are', function() {
                    var items = [{ label: 'item1', id: 'item1' }];
                    spyOn( model, 'currentItems' ).andReturn( items );

                    presenter.itemsChanged();

                    expect(my_view.onItemsChanged).toHaveBeenCalledWith( items );
                });
            });

            describe('current available actions changed', function() {
                it('should tell the view what the current available actions are', function() {
                    var actions = [{ id: 'action1' }];
                    spyOn( model, 'currentActions' ).andReturn( actions );

                    presenter.actionsChanged();

                    expect(my_view.onActionsChanged).toHaveBeenCalledWith( actions );
                });
            });
        });
    });

}());

