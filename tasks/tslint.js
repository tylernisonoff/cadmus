module.exports = function(grunt) {
  return {
    options: {
      configuration: grunt.file.readJSON('tslint.json')
    },
    src: {
      src: ['<%= files.src %>']
    },
    test: {
      src: ['<%= files.test %>']
    }
  }
};