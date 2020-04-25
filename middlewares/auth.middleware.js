const { User } = require("../db");

exports.requireAuth = (req, res, next) => {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.redirect('/auth/login');
  }
  const user = User.find({id: userId}).value();
  if (!user) {
    return res.redirect('/auth/login');
  }
  
  if (user.isAdmin) {
    res.locals.isAdmin = true;
  }
  
  next();
};
