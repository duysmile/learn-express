const sgMail = require("@sendgrid/mail");
const bcrypt = require("bcrypt");
const { User } = require("../models");

exports.getLogin = (req, res, next) => {
  var a;
  a.b();
  return res.render("auth/login", {
    csrfToken: req.csrfToken(),
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = [];
  const user = await User.findOne({ email: email });
  if (!user) {
    errors.push("User does not exist.");
    return res.render("auth/login", {
      errors: errors,
      values: req.body
    });
  }

  let wrongLoginCount = user.wrongLoginCount || 0;
  if (wrongLoginCount === 3) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: user.email,
      from: "bin210697@gmail.com",
      subject: "Wrong password when login",
      text: "Please check your account.",
      html: "<strong>Please check your account.</strong>"
    };
    sgMail.send(msg);
  }
  if (wrongLoginCount >= 5) {
    errors.push("Too much wrong password");
    return res.render("auth/login", {
      errors: errors,
      values: req.body
    });
  }
  if (!bcrypt.compareSync(password, user.password)) {
    await User.updateOne({ email: email }, { wrongLoginCount: wrongLoginCount + 1 });
    errors.push("Wrong password.");
    return res.render("auth/login", {
      errors: errors,
      values: req.body
    });
  }

  await User.updateOne({ email: email }, { wrongLoginCount: 0 });
  res.cookie("userId", user.id, {
    signed: true
  });
  if (user.isAdmin) {
    return res.redirect('/books/list');
  }
  return res.redirect("/transactions");
};
