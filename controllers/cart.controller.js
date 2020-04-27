const { Session, Book } = require('../db');

exports.addToCart = (req, res) => {
  const sessionId = req.signedCookies.sessionId;
  const bookId = req.params.id;
  const book = Book.find({ id: bookId });
  if (!sessionId || !book) {
    return res.redirect('/books');
  }

  const count = Session.find({id: sessionId})
    .get('cart.' + bookId, 0)
    .value();

  Session.find({id: sessionId})
  .set('cart.' + bookId, count + 1)
  .write();

  return res.redirect('/books');
}