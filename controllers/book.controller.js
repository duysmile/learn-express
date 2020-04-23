const shortid = require('shortid');

const {Book} = require('../db');

exports.create = (req, res) => {
  return res.render('book/create');
};

exports.index = (req, res) => {
  const books = Book.value();
  return res.render('book/list', {
    books,
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Book.remove({id}).write();
  return res.redirect('/books');
};

exports.get = (req, res) => {
  const id = req.params.id;
  const book = Book.find({ id }).value();
  return res.render('book/view', {
    book,
  });
};

exports.postCreate = (req, res) => {
  const body = req.body;
  const title = body.title;
  const description = body.description;
  Book.push({
    id: shortid.generate(),
    title,
    description,
  }).write();
  return res.redirect('/books');
};

exports.postUpdate = (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  Book.find({id}).assign({title}).write();
  return res.redirect('/books');
};
