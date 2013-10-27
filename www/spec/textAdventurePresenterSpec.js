
function Presenter(model) {
    this.model = model;
}

Presenter.prototype.exitTriggered = function(exitid) {
    this.model.exitTriggered( exitid );
};

function Model() {
}

Model.prototype.exitTriggered = function(exitid) {
};

describe('TextAdventurePresenter', function() {
    describe('on exit action', function() {
        it('should tell model to use an exit', function() {
            model = new Model();
            spyOn( model, 'exitTriggered' );
            presenter = new Presenter( model );

            presenter.exitTriggered( 'exitid' );

            expect(model.exitTriggered).toHaveBeenCalledWith( 'exitid' );
        });
    });

    //describe('on render', function() {
        //it('should tell the view what the current location description is', function() {
        //});
        //it('should tell the view what the current location exits are', function() {
        //});
        //it('should tell the view what the current location items are', function() {
        //});
        //it('should tell the view what the current available actions are', function() {
        //});
    //});
});


