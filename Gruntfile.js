'use strict';

var paths = {
  js: ['*.js', 'app/models/*.js', 'app/test/*.js', '!bower_components/**', '!node_modules/**']
};

module.exports = function(grunt) {

  if (process.env.NODE_ENV !== 'production') {
    require('time-grunt')(grunt);
  }

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      js: {
        files: paths.js,
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      }
    },
    jshint: {
      all: {
        src: paths.js,
        options: {
          jshintrc: true
        }
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          args: [],
          ignore: ['node_modules/**'],
          ext: 'js,html',
          nodeArgs: ['--debug'],
          delayTime: 1,
          cwd: __dirname
        }
      }
    },
    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
    // mochaTest: {
    //   options: {
    //     reporter: 'spec',
    //     require: [
    //       'server.js',
    //       function() {
    //         require('meanio/lib/util').preload(__dirname + '/packages/**/server', 'model');
    //       }
    //     ]
    //   },
    //   src: ['packages/**/server/tests/**/*.js']
    // },
    env: {
      test: {
        NODE_ENV: 'test'
      }
    }
  });

  //Load NPM tasks
  require('load-grunt-tasks')(grunt);

  /**
   * Default Task
   */
  grunt.hook.push('concurrent', 9999);

  //Default task.
  grunt.registerTask('default', ['hook']);

  //Test task.
  grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);

  // For Heroku users only.
  // Docs: https://github.com/linnovate/mean/wiki/Deploying-on-Heroku
  grunt.registerTask('heroku:production', []);
};
