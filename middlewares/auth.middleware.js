const { User } = require("../models");

exports.requireAuth = async (req, res, next) => {
  const userId = req.signedCookies.userId;
  if (!userId) {
    return res.redirect('/auth/login');
  }
  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.redirect('/auth/login');
  }

  if (user.isAdmin) {
    res.locals.isAdmin = true;
  }
  res.locals.user = user;

  next();
};
