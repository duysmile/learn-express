const shortid = require('shortid');

const { Transaction, User, Book, Session } = require('../db');

exports.index = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const userId = req.signedCookies.userId;

  const perPage = 5;
  const count = Transaction.value().length;
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

  let transactions = Transaction
    .filter({ userId: userId })
    .drop((page - 1) * perPage)
    .take(perPage)
    .value();
  transactions = transactions.map(transaction => {
    const user = User.find({ id: transaction.userId }).value();
    const book = Book.find({ id: transaction.bookId }).value();
    return {
      book: book.title,
      user: user.name,
      isComplete: transaction.isComplete,
      id: transaction.id,
    }
  });
  return res.render('transaction/list', {
    transactions,
    pages,
    currentPage: page,
    hasPrevious: page !== 1,
    hasNext: page !== totalPages,
  });
};

exports.create = (req, res) => {
  const books = Book.value();
  const users = User.value();
  return res.render('transaction/create', {
    books,
    users,
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Transaction.remove({ id }).write();
  return res.redirect('/transactions');
};

exports.postCreate = (req, res) => {
  const bookId = req.body.book;
  const userId = req.body.user;
  Transaction.push({
    id: shortid.generate(),
    bookId,
    userId,
  }).write();
  return res.redirect('/transactions');
};

exports.complete = (req, res) => {
  const id = req.params.id;
  const transaction = Transaction.find({ id }).value();
  if (!transaction) {
    return res.render('transaction/error', {
      errors: ['Transaction id doesn\'t exist'],
    });
  }
  Transaction.find({ id }).assign({ isComplete: true }).write();
  return res.redirect('/transactions');
}

exports.addFromCart = (req, res) => {
  const userId = req.signedCookies.userId;
  const sessionId = req.signedCookies.sessionId;

  const cart = Session.find({id: sessionId}).get('cart', {}).value();
  Object.keys(cart).forEach(bookId => {
    const id = shortid.generate();
    const transaction = {
      id,
      userId,
      bookId,
      count: cart[bookId],
    };
    Transaction.push(transaction).write();
  });
  Session.find({id: sessionId}).set('cart', {}).write();
  return res.redirect('/transactions');
}
