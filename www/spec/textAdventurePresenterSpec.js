
function Presenter(model, view) {
    this.model = model;
    this.view = view;
}

Presenter.prototype.exitTriggered = function(exitid) {
    this.model.exitTriggered( exitid );
};

Presenter.prototype.render = function() {
    this.view.onDescriptionChanged( this.model.currentLocationDescription() );
};

function Model() {
}

Model.prototype.exitTriggered = function(exitid) {
};

Model.prototype.currentLocationDescription = function() {
    return '';
};

describe('TextAdventurePresenter', function() {
    beforeEach(function() {
        model = new Model();
        presenter = new Presenter( model, view );
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
            spyOn( model, 'currentLocationDescription' ).andReturn( 'description' );
            spyOn( view, 'onDescriptionChanged' );

            presenter.render();

            expect(view.onDescriptionChanged).toHaveBeenCalledWith( 'description' );
        });
        //it('should tell the view what the current location exits are', function() {
        //});
        //it('should tell the view what the current location items are', function() {
        //});
        //it('should tell the view what the current available actions are', function() {
        //});
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


