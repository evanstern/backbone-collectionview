/* jshint camelcase:false */

// Gruntfile
'use strict';

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configurable paths
  var config = {
    src: 'src',
    test: 'test',
    docs: 'docs'
  };

  // Define task configuration
  grunt.initConfig({
    // Reference the package.json file internally
    pkg: grunt.file.readJSON('package.json'),

    config: config,

    watch: {
      scripts: {
        files: ['<%= config.src %>/**/*.js'],
        tasks: ['jshint']
      },
      karma: {
        files: [
          '<%= config.src %>/**/*.js',
          '<%= config.test %>/<%= karma.options.frameworks[0] %>/specs/*.spec.js'
        ],
        tasks: ['build', 'karma:once']
      }
    },

    clean: {
      files: [
        'backbone-collectionview.js',
        'backbone-collectionview.min.js',
        'backbone-collectionview.map.js'
      ],
      src: ['docs']
    },

    jshint: {
      ignore_warnings: {
        options: {
          '-W030': true
        },
        files: {
          src: ['<%= config.src %>/**/*.js']
        }
      },
      options: {
        ignores: [],
        laxcomma: true
      }
    },

    preprocess: {
      core: {
        files: {
          'backbone-collectionview.js': 'src/backbone-collectionview.js'
        }
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        sourceMapName: 'backbone-collectionview.map.js'
      },
      'backbone-collectionview.min.js': ['backbone-collectionview.js']
    },

    docco: {
      docs: {
        src: ['<%= config.src %>/**/*.js'],
        options: {
          output: '<%= config.docs %>'
        }
      }
    },

    karma: {
      options: {
        basePath: process.cwd(),
        singleRun: true,
        captureTimeout: 7000,
        browsers: ['PhantomJS'],
        frameworks: ['mocha', 'sinon-chai'],
        plugins: [
          'karma-mocha',
          'karma-phantomjs-launcher',
          'karma-sinon-chai'
        ],
        files: [
          'bower_components/chai/chai.js',
          'bower_components/sinonjs/sinon.js',
          'bower_components/sinon-chai/lib/sinon-chai.js',
          'bower_components/requirejs/require.js',
          '<%= config.test %>/runner.js',
          '<%= config.src %>/require-config.js',
          {
            pattern: 'backbone-collectionview.js',
            included: false
          },
          {
            pattern: '<%= config.test %>/<%= karma.options.frameworks[0] %>/specs/*.spec.js',
            included: false
          },
          {
            pattern: 'bower_components/**/*.js',
            included: false
          }
        ]
      },
      run: {
        options: {
          singleRun: false
        }
      },
      once: {
        options: {
          singleRun: true
        }
      }
    }

  });

  grunt.registerTask('build', ['clean', 'preprocess', 'uglify']);
  grunt.registerTask('default', ['build']);
};

