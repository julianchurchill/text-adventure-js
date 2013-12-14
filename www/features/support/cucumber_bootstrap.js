/*global exports*/

// Note - whenever this file changes please use 'browserify' to create a corresponding cucumber_bootstrap_bundle.js file

(function () {
    "use strict";

    var Location = require('../../js/location.js');
    var Model = require('../../js/model.js');

    var textadventuremodel = new Model();
    var location2 = new Location( { description: 'library description' } );
    var location1 = new Location( { exits: [ { id: 'Library', destination: location2 } ] } );
    textadventuremodel.setCurrentLocation( location1 );
})();
