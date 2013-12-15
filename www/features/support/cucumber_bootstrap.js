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

    var location2 = new Location( { id: 'Library',
                                    description: 'library description' } );
    var location1 = new Location( { id: 'location 1',
                                    description: 'location 1',
                                    exits: [ { id: 'Library', destination: 'Library' } ] } );
    model.setCurrentLocation( location1 );
})();
