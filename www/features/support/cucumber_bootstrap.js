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
                                    description: 'Library description' } );
    var sittingroom = new Location( { id: 'sittingroom',
                                    description: 'Sitting room description',
                                    exits: [ { id: 'library_exit', destination: library, label: 'Library' } ] } );
    // Exits must be set up after location objects exist
    library.properties.exits = [ { id: 'sittingroom_exit', destination: sittingroom, label: 'Sitting room' } ];

    model.setCurrentLocation( sittingroom );
})();
