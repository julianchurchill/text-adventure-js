/*global exports*/

// Note - whenever this file changes please use 'browserify' to create a corresponding app_bootstrap_bundle.js file

(function () {
    "use strict";

    var Model = require('./model.js');
    var View = require('./view.js');
    var Presenter = require('./presenter.js');

    var view = new View();
    var model = new Model();
    var presenter = new Presenter(model, view);
    view.setActionHandler( presenter );

    var model_json = require('./model.json');
    model.loadModelFromJSON( model_json );
})();
