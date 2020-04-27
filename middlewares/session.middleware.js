const shortid = require('shortid');
const { Session } = require('../db');

module.exports = (req, res, next) => {
  const sessionId = req.signedCookies.sessionId;
  if (!sessionId) {
    const newSessionId = shortid.generate();
    res.cookie('sessionId', newSessionId, {
      signed: true,
    });

    Session.push({ id: newSessionId }).write();
    res.locals.cartCount = 0;
  } else {
    const cart = Session.find({id: sessionId}).get('cart', {}).value();
    const cartCount = Object.values(cart).reduce((acc, item) => {
      return acc + item;
    }, 0);
    res.locals.cartCount = cartCount;
  }

  next();
}