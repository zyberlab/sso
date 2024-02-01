const assert = require('assert');
const app = require('../../src/app');

describe('\'divisions\' service', () => {
  it('registered the service', () => {
    const service = app.service('divisions');

    assert.ok(service, 'Registered the service');
  });
});
