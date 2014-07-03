// Gruntfile
'use strict';

module.exports({

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configurable paths
  var config = {
    source: 'src',
    test: 'test'
  };

  // Define task configuration
  grunt.initConfig({
    // Reference the package.json file internally
    pkg: grunt.file.readJSON('package.json'),

    config: config,

    watch: {
    },

    clean: {
    },

    jshint: {
    },

    copy: {
    },

    preprocess: {
    },

    uglify: {
    },

    docco: {
    },

    karma: {
    }

  });

  grunt.registerTask('default', []);
});

