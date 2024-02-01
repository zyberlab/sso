const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const { jwtDecode } = require('jwt-decode');

module.exports = function (app) {
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(local());

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [authentication.hooks.authenticate(config.strategies)],
      remove: [authentication.hooks.authenticate('jwt')],
    },
    after: {
      create: async (context) => {
        console;

        const payload = jwtDecode(context.result.accessToken);
        context.result.user = await context.app
          .service('users')
          .get(payload.userId);
        // console.log('tt', await context.app.service('users').get(payload.userId))
        return context;
      },
    },
  });
};
