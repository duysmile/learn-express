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
  User.push({
    id: shortid.generate(),
    name,
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
