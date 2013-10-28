
function Presenter(model, view) {
    this.model = model;
    this.view = view;
}

Presenter.prototype.exitTriggered = function(exitid) {
    this.model.exitTriggered( exitid );
};

Presenter.prototype.render = function() {
    this.view.onDescriptionChanged( this.model.currentDescription() );
    this.view.onExitsChanged( this.model.currentExits() );
    this.view.onItemsChanged( this.model.currentItems() );
    this.view.onActionsChanged( this.model.currentActions() );
};

function Model() {
}

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
    beforeEach(function() {
        model = new Model();
        my_view = jasmine.createSpyObj('view', ['onDescriptionChanged',
                                                'onExitsChanged',
                                                'onItemsChanged',
                                                'onActionsChanged']);
        presenter = new Presenter( model, my_view );
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

    //describe('on event from model', function() {
        //describe('current location changed', function() {
            //it('should tell the view what the current location description is', function() {
            //});
            //it('should tell the view what the current location exits are', function() {
            //});
            //it('should tell the view what the current location items are', function() {
            //});
            //it('should tell the view what the current available actions are', function() {
            //});
        //});

        //describe('current location description changed', function() {
            //it('should tell the view what the current location description is', function() {
            //});
        //});

        //describe('current location exits changed', function() {
            //it('should tell the view what the current location exits are', function() {
            //});
        //});

        //describe('current location items changed', function() {
            //it('should tell the view what the current location items are', function() {
            //});
        //});

        //describe('current available actions changed', function() {
            //it('should tell the view what the current available actions are', function() {
            //});
        //});
    //});
});


