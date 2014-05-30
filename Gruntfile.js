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
        build: 'build'
      }
    }
  });
};