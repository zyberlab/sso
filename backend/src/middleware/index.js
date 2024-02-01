const axios = require('axios');
const cookieParser = require('cookie-parser');
const { authenticate } = require('@feathersjs/authentication').express;
const bcrypt = require('bcryptjs');

module.exports = function (app) {
  // Add your custom middleware here. Remember, that
  // in Express the order matters

  // app.post('/api/authentication', async (req, res) => {
  //   try {
  //     const { idNumber, password } = req.body;
  //     await axios.post('http://localhost:3536/authentication', {
  //       strategy: 'local',
  //       email: `${idNumber}@mail.com`,
  //       password: password
  //     });
  //     return res.json({
  //       success: true
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     return res.json({
  //       success: false
  //     });
  //   }
  // });

  app.get('/verify-jwt', cookieParser(), authenticate('jwt'), function (
    req,
    res
  ) {
    const { user } = req;
    return res.json(user);
  });

  app.post(
    '/api/verify-password',
    cookieParser(),
    authenticate('jwt'),
    function (req, res) {
      const { user } = req;
      bcrypt.compare(req.body.password, user.password, function (
        error,
        result
      ) {
        if (error) {
          return res.json({
            success: false,
            message: 'Unexpected error occurred',
          });
        } else if (result) {
          return res.json({
            success: true,
          });
        } else {
          return res.json({
            success: false,
            message: 'Incorrect password',
          });
        }
      });
    }
  );
};
