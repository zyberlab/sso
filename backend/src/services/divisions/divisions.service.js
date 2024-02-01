// Initializes the `divisions` service on path `/divisions`
const createService = require('feathers-nedb');
const createModel = require('../../models/divisions.model');
const hooks = require('./divisions.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'divisions',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/divisions', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('divisions');

  service.hooks(hooks);
};
