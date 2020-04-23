const shortid = require('shortid');

const {Transaction, User, Book} = require('../db');

exports.index = (req, res) => {
  let transactions = Transaction.value();
  transactions = transactions.map(transaction => {
    const user = User.find({id: transaction.userId}).value();
    const book = Book.find({id: transaction.bookId}).value();
    return {
      book: book.title,
      user: user.name,
      isComplete: transaction.isComplete,
      id: transaction.id,
    }
  });
  return res.render('transaction/list', {
    transactions,
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
  Transaction.remove({id}).write();
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
  const transaction = Transaction.find({id}).value();
  if (!transaction) {
    return res.render('transaction/error', {
      errors: ['Transaction id doesn\'t exist'],
    }); 
  }
  Transaction.find({id}).assign({isComplete: true}).write();
  return res.redirect('/transactions');
}
