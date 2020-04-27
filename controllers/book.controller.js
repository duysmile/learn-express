const shortid = require('shortid');
const cloudinary = require("cloudinary").v2;

const { Book } = require('../db');

exports.create = (req, res) => {
  return res.render('book/create', {
    csrfToken: req.csrfToken(),
  });
};

exports.index = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 20;
  const count = Book.value().length;
  const totalPages = Math.ceil(count / perPage);
  const maxPageSide = 2;
  let begin = 0;
  let end = 0;

  if (count < maxPageSide * 2 + 1) {
    begin = 1;
    end = count;
  } else if (page - maxPageSide <= 0) {
    begin = 1;
    end = begin + maxPageSide * 2 + 1;
  } else if (page + maxPageSide > totalPages) {
    end = totalPages + 1;
    begin = end - (maxPageSide * 2 + 1);
  } else {
    begin = page - maxPageSide;
    end = begin + maxPageSide * 2 + 1;
  }

  const pages = [];
  for (let i = begin; i < end; i++) {
    pages.push(i);
  }
  const books = Book.drop((page - 1) * perPage)
    .take(perPage)
    .value();
  return res.render('book/index', {
    books,
    pages,
    currentPage: page,
    hasPrevious: page !== 1,
    hasNext: page !== totalPages,
  });
};

exports.list = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 20;
  const count = Book.value().length;
  const totalPages = Math.ceil(count / perPage);
  const maxPageSide = 2;
  let begin = 0;
  let end = 0;

  if (count < maxPageSide * 2 + 1) {
    begin = 1;
    end = count;
  } else if (page - maxPageSide <= 0) {
    begin = 1;
    end = begin + maxPageSide * 2 + 1;
  } else if (page + maxPageSide > totalPages) {
    end = totalPages + 1;
    begin = end - (maxPageSide * 2 + 1);
  } else {
    begin = page - maxPageSide;
    end = begin + maxPageSide * 2 + 1;
  }

  const pages = [];
  for (let i = begin; i < end; i++) {
    pages.push(i);
  }
  const books = Book.drop((page - 1) * perPage)
    .take(perPage)
    .value();
  return res.render('book/list', {
    books,
    pages,
    currentPage: page,
    hasPrevious: page !== 1,
    hasNext: page !== totalPages,
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Book.remove({ id }).write();
  return res.redirect('/books');
};

exports.get = (req, res) => {
  const id = req.params.id;
  const book = Book.find({ id }).value();
  return res.render('book/view', {
    book,
    csrfToken: req.csrfToken(),
  });
};

exports.postCreate = (req, res) => {
  const path = req.file.path;
  cloudinary.uploader.upload(path, function (error, result) {
    const body = req.body;
    const title = body.title;
    const description = body.description;
    
    if (error) {
      return res.render('book/create', {
        errors: [error.message],
        values: req.body,
      });
    }

    const coverUrl = result.secure_url;
    Book.push({
      id: shortid.generate(),
      coverUrl,
      title,
      description,
    }).write();
    return res.redirect('/books/list');
  });
};

exports.postUpdate = (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  Book.find({ id }).assign({ title }).write();
  return res.redirect('/books');
};
