const md5 = require('md5');
const shortid = require('shortid');

const {User} = require('../db');

exports.index = (req, res) => {
  const users = User.value();
  return res.render('user/list', {
    users,
  });
};

exports.create = (req, res) => {
  return res.render('user/create');
};

exports.get = (req, res) => {
  const id = req.params.id;
  const user = User.find({ id }).value();
  return res.render('user/view', {
    user,
  });
};

exports.postCreate = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const existedUser = User.find({ email: email }).value();
  if (existedUser) {
    return res.render('user/create', {
      errors: ['Email exists.'],
      values: req.body,
    });
  }
  User.push({
    id: shortid.generate(),
    name,
    email,
    password: md5(password),
  }).write();
  return res.redirect('/users');
};

exports.postUpdate = (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  User.find({id}).assign({name}).write();
  return res.redirect('/users');
};

exports.delete = (req, res) => {
  const id = req.params.id;
  User.remove({id}).write();
  return res.redirect('/users');
};
