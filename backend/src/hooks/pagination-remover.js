// A hook that removes pagination and returns all data

module.exports = function () {
  return function (hook) {
    if(hook.params.query && hook.params.query.hasOwnProperty('$paginate')) {
      hook.params.paginate = hook.params.query.$paginate === 'false' || hook.params.query.$paginate === false;
      delete hook.params.query.$paginate;
    }
  };
};