const crypto = require('crypto')
const User = require('../models/User')

exports.signup = async (req, res, next) => {
  User.register(
    new User({ 
      email: req.body.email, 
      username: req.body.username,
    }), req.body.password, function (err, msg) {
      if (err) {
        res.send(err);
      } else {
        res.send({ message: "Successful" });
      }
    }
  )
};