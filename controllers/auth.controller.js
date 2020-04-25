const md5 = require('md5');
const { User } = require("../db");

exports.getLogin = (req, res, next) => {
  return res.render('auth/login');
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  
  const errors = [];
  const user = User.find({email: email}).value();
  if (!user) {
    errors.push('User does not exist.')
    return res.render('auth/login', {
      errors: errors,
      values: req.body,
    });
  }
  
  const hashedPassword = md5(password);
  if (user.password !== hashedPassword) {
    errors.push('Wrong password.')
    return res.render('auth/login', {
      errors: errors,
      values: req.body,
    });
  }
  
  res.cookie('userId', user.id);
  return res.redirect('/transactions');
};
