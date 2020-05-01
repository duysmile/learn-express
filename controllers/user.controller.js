const bcrypt = require("bcrypt");
const shortid = require("shortid");
const cloudinary = require("cloudinary").v2;

const { User } = require("../models");

exports.index = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 5;
  const count = await User.countDocuments();
  const totalPages = Math.ceil(count / perPage);
  const maxPageSide = 2;
  let begin = 0;
  let end = 0;

  if (totalPages < maxPageSide * 2 + 1) {
    begin = 1;
    end = totalPages + 1;
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

  const users = await User.find()
    .skip((page - 1) * perPage)
    .limit(perPage);
  return res.render("user/list", {
    users,
    pages,
    currentPage: page,
    hasPrevious: page !== 1,
    hasNext: page !== totalPages
  });
};

exports.create = (req, res) => {
  return res.render("user/create", {
    csrfToken: req.csrfToken(),
  });
};

exports.get = async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: id });
  return res.render("user/view", {
    user,
    csrfToken: req.csrfToken(),
  });
};

exports.postCreate = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const existedUser = await User.findOne({ email: email });
  if (existedUser) {
    return res.render("user/create", {
      errors: ["Email exists."],
      values: req.body
    });
  }
  const hashedPassword = bcrypt.hashSync(password, 2);
  await User.create({
    name,
    email,
    password: hashedPassword
  });
  return res.redirect("/users");
};

exports.postUpdate = async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  await User.updateOne({ _id: id }, { name });
  return res.redirect("/users");
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  await User.delete({ _id: id });
  return res.redirect("/users");
};

exports.profile = async (req, res) => {
  const userId = req.signedCookies.userId;
  const user = await User.findOne({ _id: userId });
  return res.render("user/profile", {
    user,
    csrfToken: req.csrfToken(),
  });
};

exports.updateProfile = async (req, res) => {
  const id = req.signedCookies.userId;
  const name = req.body.name;
  await User.updateOne({ _id: id }, { name });
  return res.redirect("/users");
};

exports.changeAvatar = (req, res) => {
  const userId = req.signedCookies.userId;
  const user = User.findOne({ _id: userId });
  return res.render("user/avatar", {
    avatar: user.avatar,
    csrfToken: req.csrfToken(),
  });
};

exports.postChangeAvatar = (req, res) => {
  const path = req.file.path;
  cloudinary.uploader.upload(path, async (error, result) => {
    const userId = req.signedCookies.userId;

    if (error) {
      return res.render('user/avatar', {
        errors: [error.message],
      });
    }
    const avatar = result.secure_url;
    await User.updateOne({ _id: userId }, { avatar: avatar });
    return res.render("user/profile", {
      user: user,
    });
  });
};
