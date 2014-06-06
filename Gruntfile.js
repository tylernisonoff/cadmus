var loadGruntConfig = require('load-grunt-config');
var path = require('path');

module.exports = function(grunt) {
  loadGruntConfig(grunt, {
    configPath: path.join(process.cwd(), 'tasks'),
    data: {
      files: {
        tslint: 'tslint.json',
        src: 'src/**/*.ts',
        test: 'test/**/*.ts',
        build: 'build',
        index: 'build/src/index.js',
        app: 'build/src/**/*.js',
        spec: 'build/test/**/*.js'
      }
    }
  });

  grunt.registerTask('default', [
    'tslint:src',
    'typescript:src'
  ]);

  grunt.registerTask('dev', [
    'default',
    'express:dev',
    'watch'
  ]);

  grunt.registerTask('lint', ['tslint']);

  grunt.registerTask('test', [
    'tslint',
    'typescript',
    'mochaTest'
  ]);
};