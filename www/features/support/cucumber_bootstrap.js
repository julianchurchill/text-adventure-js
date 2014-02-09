/*global exports*/

// Note - whenever this file changes please use 'browserify' to create a corresponding cucumber_bootstrap_bundle.js file

(function () {
    "use strict";

    var Model = require('../../js/model.js');
    var View = require('../../js/view.js');
    var Presenter = require('../../js/presenter.js');

    var view = new View();
    var model = new Model();
    var presenter = new Presenter(model, view);
    view.setActionHandler( presenter );

    var sittingroom_json = { id: 'sittingroom',
                                    description: 'Sitting room description',
                                    exits: [ { id: 'library_exit', destinationid: 'Library', label: 'Library' } ] };
    var library_json     = { id: 'Library',
                                    description: 'Library description',
                                    exits: [ { id: 'sittingroom_exit', destinationid: 'sittingroom', label: 'Sitting room' } ] };
    model.loadModelFromJSON( [ sittingroom_json, library_json ] );
})();
