/*global exports*/

// Note - whenever this file changes please use 'browserify' to create a corresponding cucumber_bootstrap_bundle.js file

(function () {
    "use strict";

    var Location = require('../../js/location.js');
    var Model = require('../../js/model.js');
    var View = require('../../js/view.js');
    var Presenter = require('../../js/presenter.js');

    var view = new View();
    var model = new Model();
    var presenter = new Presenter(model, view);
    view.setActionHandler( presenter );

    var library     = new Location( { id: 'Library',
                                    description: 'Library description',
                                    exits: [ { id: 'sittingroom_exit', destinationid: 'sittingroom', label: 'Sitting room' } ] } );
    var sittingroom = new Location( { id: 'sittingroom',
                                    description: 'Sitting room description',
                                    exits: [ { id: 'library_exit', destinationid: 'Library', label: 'Library' } ] } );

    model.addLocation( library );
    model.addLocation( sittingroom );

    model.setCurrentLocation( sittingroom );
})();
