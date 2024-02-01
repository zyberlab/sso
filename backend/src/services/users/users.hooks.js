const { authenticate } = require('@feathersjs/authentication').hooks;
const search = require('feathers-nedb-fuzzy-search');


const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;


module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt'), search({
      fields: ['roles', 'personal_information.first_name', 'personal_information.surname'],
      deep: true
    }), logRequest() ],
    get: [ authenticate('jwt') ],
    create: [ hashPassword() ],
    update: [ hashPassword(),  authenticate('jwt') ],
    patch: [ hashPassword(),  authenticate('jwt') ],
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [
      logRequest(),
      context => {
        const timestamp = Date.now();
  
        // const { data, userId } = context.data;
        // console.log(context)

        context.user = { 'test': 'pogi'}

        return context
      }
    ],
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

function logRequest() {
  return async (context) => {
  }
}
