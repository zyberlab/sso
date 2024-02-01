// Application hooks that run for every service
const logger = require('./hooks/logger');
const paginationRemover = require('./hooks/pagination-remover');

module.exports = {
  before: {
    all: [ logger() ],
    find: [paginationRemover()],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
