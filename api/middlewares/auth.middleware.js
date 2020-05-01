const { User } = require("../../models");

exports.requireAuth = async (req, res, next) => {
  const userId = req.signedCookies.userId;
  if (!userId) {
    return res.stauts(400).json({
      errors: ['UserId not found'],
    });
  }
  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(400).json({
      errors: ['User does not exist'],
    });
  }

  req.user = user;
  next();
};
