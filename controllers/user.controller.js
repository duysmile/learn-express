const bcrypt = require("bcrypt");
const shortid = require("shortid");
const cloudinary = require("cloudinary").v2;

const { User } = require("../db");

exports.index = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 5;
  const count = User.value().length;
  const totalPages = Math.ceil(count / perPage);
  const maxPageSide = 2;
  let begin = 0;
  let end = 0;

  if (count < maxPageSide * 2 + 1) {
    begin = 1;
    end = count;
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

  const users = User.drop((page - 1) * perPage)
    .take(perPage)
    .value();
  return res.render("user/list", {
    users,
    pages,
    currentPage: page,
    hasPrevious: page !== 1,
    hasNext: page !== totalPages
  });
};

exports.create = (req, res) => {
  return res.render("user/create");
};

exports.get = (req, res) => {
  const id = req.params.id;
  const user = User.find({ id }).value();
  return res.render("user/view", {
    user
  });
};

exports.postCreate = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const existedUser = User.find({ email: email }).value();
  if (existedUser) {
    return res.render("user/create", {
      errors: ["Email exists."],
      values: req.body
    });
  }
  const hashedPassword = bcrypt.hashSync(password, 2);
  User.push({
    id: shortid.generate(),
    name,
    email,
    password: hashedPassword
  }).write();
  return res.redirect("/users");
};

exports.postUpdate = (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  User.find({ id })
    .assign({ name })
    .write();
  return res.redirect("/users");
};

exports.delete = (req, res) => {
  const id = req.params.id;
  User.remove({ id }).write();
  return res.redirect("/users");
};

exports.profile = (req, res) => {
  const userId = req.signedCookies.userId;
  const user = User.find({ id: userId }).value();
  return res.render("user/profile", {
    user
  });
};

exports.updateProfile = (req, res) => {
  const id = req.signedCookies.userId;
  const name = req.body.name;
  User.find({ id })
    .assign({ name })
    .write();
  return res.redirect("/users");
};

exports.changeAvatar = (req, res) => {
  const userId = req.signedCookies.userId;
  const user = User.find({ id: userId }).write();
  return res.render("user/avatar", {
    avatar: user.avatar
  });
};

exports.postChangeAvatar = (req, res) => {
  const path = req.file.path;
  cloudinary.uploader.upload(path, function(error, result) {
    const userId = req.signedCookies.userId;
    const user = User.find({ id: userId }).write();
  
    if (error) {
      return res.render('user/avatar', {
        errors: [error.message],
      });
    }
    const avatar = result.secure_url;
    User.find({id: userId}).assign({avatar: avatar}).write();
    return res.render("user/profile", {
      user: user,
    });
  });
};
