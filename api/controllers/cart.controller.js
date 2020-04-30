const { Session, Book } = require('../../models');

exports.addToCart = async (req, res) => {
  const sessionId = req.signedCookies.sessionId;
  const bookId = req.params.id;
  const book = await Book.findOne({ _id: bookId });
  if (!sessionId || !book) {
    return res.redirect('/books');
  }

  const session = await Session.findOne({ _id: sessionId });
  const count = session.cart ? (session.cart.get(bookId) || 0) : 0;

  await session
    .set('cart.' + bookId, count + 1)
    .save();

  return res.redirect('/books');
}