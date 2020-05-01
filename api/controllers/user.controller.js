const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;

const { User } = require("../../models");

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
  return res.json({
    users,
    pages,
    currentPage: page,
    hasPrevious: page !== 1,
    hasNext: page !== totalPages
  });
};

exports.get = async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: id });
  return res.json({
    user,
  });
};

exports.postCreate = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const existedUser = await User.findOne({ email: email });
  if (existedUser) {
    return res.status(400).json({
      errors: ["Email exists."],
    });
  }
  const hashedPassword = bcrypt.hashSync(password, 2);
  await User.create({
    name,
    email,
    password: hashedPassword
  });
  return res.json({
    success: true,
  });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  await User.updateOne({ _id: id }, { name });
  return res.json({
    success: true,
  });
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  await User.delete({ _id: id });
  return res.json({ success: true });
};

exports.profile = async (req, res) => {
  const userId = req.signedCookies.userId;
  const user = await User.findOne({ _id: userId });
  return res.json({
    user,
  });
};

exports.updateProfile = async (req, res) => {
  const id = req.signedCookies.userId;
  const name = req.body.name;
  await User.updateOne({ _id: id }, { name });
  return res.json({
    success: true,
  });
};

exports.changeAvatar = (req, res) => {
  const userId = req.signedCookies.userId;
  const user = User.findOne({ _id: userId });
  return res.json({
    avatar: user.avatar,
  });
};

exports.postChangeAvatar = (req, res) => {
  const path = req.file.path;
  cloudinary.uploader.upload(path, async (error, result) => {
    const userId = req.signedCookies.userId;

    if (error) {
      return res.status(400).json({
        errors: [error.message],
      });
    }
    const avatar = result.secure_url;
    await User.updateOne({ _id: userId }, { avatar: avatar });
    return res.json({
      user: user,
    });
  });
};
