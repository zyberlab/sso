const users = require('./users/users.service.js');
const divisions = require('./divisions/divisions.service.js');
const classifications = require('./classifications/classifications.service.js');
const notifications = require('./notifications/notifications.service.js');
const signatures = require('./signatures/signatures.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(divisions);
  app.configure(classifications);
  app.configure(notifications);
  app.configure(signatures);
};
