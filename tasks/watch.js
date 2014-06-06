module.exports = {
  express: {
    files: ['<%= files.app %>'],
    tasks: ['express:dev'],
    options: {
      spawn: false
    }
  },
  typescript: {
    files: ['<%= files.src %>'],
    tasks: ['typescript:src']
  }
};