module.exports = {
  options: {
    target: 'ES5',
    indentStep: 2
  },
  src: {
    src: ['<%= files.src %>'],
    dest: '<%= files.build %>'
  },
  test: {
    src: ['<%= files.test %>'],
    dest: '<%= files.build %>'
  }
};