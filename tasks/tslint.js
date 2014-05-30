module.exports = function(grunt) {
  return {
    options: {
      configuration: grunt.file.readJSON('tslint.json')
    },
    files: {
      src: [
        '<%= files.src %>',
        '<%= files.test %>'
      ]
    }
  }
};