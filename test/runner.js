(function(window) {
    "use strict";

    var karma = window.__karma__;

    // Put Karma into an asynchronous waiting mode until we have loaded our
    // tests.
    karma.loaded = function() {};

    if (window.QUnit) {
        // Disable auto start.  We'll call start once the async modules have
        // loaded.
        window.QUnit.config.autostart = false;
    } else if (window.chai) {
        // Optionally use chai with Mocha.
        window.expect = window.chai.expect;
        var should = window.chai.should();
    }

    // Set the application endpoint and load the configuration.
    require.config({
        baseUrl: "/base/src",

        paths: {
            underscore: '../bower_components/underscore/underscore'
            , 'backbone-collectionview': '../backbone-collectionview'
        }
    });

    require([
      "require-config"
      , "underscore"
      , "backbone-collectionview"
    ], function(config, _) {
      var specs = _.chain(karma.files)
      // Convert the files object to an array of file paths.
      .map(function(id, file) {
          return file;
      })
      // Tests that end with `.spec.js' and existing either `app` or `test`
      // directories are automatically loaded.
      .filter(function(file) {
          return (/(js|test)\/.*\.spec\.js$/).test(file);
      })
          .value();

      // Load all specs and start Karma.
      require(specs, karma.start);
    });
})(this);
