const { Session } = require('../models');

module.exports = async (req, res, next) => {
  const sessionId = req.signedCookies.sessionId;
  if (!sessionId) {
    const session = await Session.create({});
    res.cookie('sessionId', session._id.toString(), {
      signed: true,
    });

    res.locals.cartCount = 0;
  } else {
    const session = await Session.findOne({ _id: sessionId }).lean();
    const cart = session.cart || {};
    const cartCount = Object.values(cart).reduce((acc, item) => {
      return acc + item;
    }, 0);
    res.locals.cartCount = cartCount;
  }

  next();
}