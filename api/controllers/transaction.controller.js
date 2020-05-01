const { Transaction, User, Book, Session } = require('../../models');

exports.index = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const userId = req.signedCookies.userId;

  const perPage = 5;
  const count = await Transaction.countDocuments();
  const totalPages = Math.ceil(count / perPage);
  const maxPageSide = 2;

  let begin = 0;
  let end = 0;
  if (totalPages < maxPageSide * 2 + 1) {
    begin = 1;
    end = totalPages + 1;
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

  const transactions = await Transaction
    .find({ 'user._id': userId })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .lean();
  
    return res.json({
      transactions,
      success: true,
    });
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  await Transaction.deleteOne({ _id: id });
  return res.json({
    success: true,
  });
};

exports.postCreate = async (req, res) => {
  const bookId = req.body.book;
  const userId = req.body.user;

  const book = await Book.findOne({ _id: bookId });
  const user = await User.findOne({ _id: userId });
  await Transaction.create({
    user,
    book,
    count: 1,
  });
  return res.json({
    success: true,
  });
};

exports.complete = async (req, res) => {
  const id = req.params.id;
  const transaction = await Transaction.findOne({ _id: id });
  if (!transaction) {
    return res.status(400).json({
      errors: ['Transaction id doesn\'t exist'],
    });
  }
  await Transaction.updateOne({ _id: id }, { isComplete: true });
  return res.json({
    success: true,
  });
}

exports.addFromCart = async (req, res) => {
  const userId = req.signedCookies.userId;
  const sessionId = req.signedCookies.sessionId;

  const user = await User.findOne({ _id: userId });
  const session = await Session.findOne({ _id: sessionId }).lean();
  const cart = session.cart || {};

  const listBookId = Object.keys(cart);
  const books = await Book.find({ _id: listBookId });

  const listTransaction = books.map(book => {
    return {
      user,
      book,
      count: cart[book._id.toString()],
    };
  });

  await Transaction.insertMany(listTransaction);
  await Session.updateOne({ _id: sessionId }, { cart: {} });
  return res.json({
    success: true,
  });
}
