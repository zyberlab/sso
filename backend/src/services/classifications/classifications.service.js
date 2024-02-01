// Initializes the `classifications` service on path `/classifications`
const createService = require('feathers-nedb');
const createModel = require('../../models/classifications.model');
const hooks = require('./classifications.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'classifications',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/classifications', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('classifications');

  service.hooks(hooks);
};
