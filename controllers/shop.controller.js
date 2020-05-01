const shortid = require('shortid');
const { User, Book } = require('../models');

exports.getBooks = async (req, res) => {
  const shopId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const perPage = 20;
  const count = await Book.countDocuments({
    shop: shopId,
  });
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
  const books = await Book.find({
    shop: shopId,
  })
    .limit(perPage)
    .skip((page - 1) * perPage)
    .lean();
  return res.render('book/list', {
    books,
    pages,
    currentPage: page,
    hasPrevious: page !== 1,
    hasNext: page !== totalPages,
  });
};

exports.postCreate = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.shop) {
      return res.redirect('/shops/' + user.shop + '/books');
    }

    const shopId = shortid.generate();
    await User.updateOne({
      _id: user._id,
    }, {
      shop: shopId,
    });
    return res.redirect('/shops/' + shopId + '/books');
  } catch (error) {
    next(error);
  }
};

exports.postUpdate = async (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  await Book.updateOne({ _id: id }, { title });
  return res.redirect('/books');
};
