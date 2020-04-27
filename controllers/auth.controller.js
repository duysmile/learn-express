const sgMail = require("@sendgrid/mail");
const bcrypt = require("bcrypt");
const { User } = require("../db");

exports.getLogin = (req, res, next) => {
  return res.render("auth/login");
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = [];
  const user = User.find({ email: email }).value();
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
    User.find({ email: email })
      .assign({ wrongLoginCount: wrongLoginCount + 1 })
      .write();
    errors.push("Wrong password.");
    return res.render("auth/login", {
      errors: errors,
      values: req.body
    });
  }

  User.find({ email: email })
    .assign({ wrongLoginCount: 0 })
    .write();
  res.cookie("userId", user.id, {
    signed: true
  });
  if (user.isAdmin) {
    return res.redirect('/books/list');
  }
  return res.redirect("/transactions");
};
