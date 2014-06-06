module.exports = {
  options: {
    target: 'ES5',
    module: 'commonjs',
    indentStep: 2,
    noImplicitAny: true
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