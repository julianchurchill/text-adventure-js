/*global module, exports*/

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

    Presenter.prototype.descriptionChanged = function() {
        this.view.onDescriptionChanged( this.model.currentDescription() );
    };

    Presenter.prototype.exitsChanged = function() {
        this.view.onExitsChanged( this.model.currentExits() );
    };

    Presenter.prototype.itemsChanged = function() {
        this.view.onItemsChanged( this.model.currentItems() );
    };

    Presenter.prototype.actionsChanged = function() {
        this.view.onActionsChanged( this.model.currentActions() );
    };

    Presenter.prototype.render = function() {
        this.descriptionChanged();
        this.exitsChanged();
        this.itemsChanged();
        this.actionsChanged();
    };

    module.exports = Presenter;
})();
