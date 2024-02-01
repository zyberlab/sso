const { authenticate } = require('@feathersjs/authentication').hooks;
const crypto = require('crypto');

const generateHash = (str) => crypto.createHash('md5').update(str).digest('hex');

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [context => {
      const timestamp = Date.now();

      const { data, userId } = context.data;

      context.data.timestamp = timestamp;
      context.data.hash = generateHash(`${JSON.stringify(data)}_${timestamp}_${userId}`);

      delete context.data.data;

      return context;
    }, authenticate('jwt')],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
