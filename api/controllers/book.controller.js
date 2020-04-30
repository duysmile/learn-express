const cloudinary = require("cloudinary").v2;

const { Book } = require('../../models');

exports.index = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 20;
  const count = await Book.countDocuments();
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
  const books = await Book.find()
    .limit(perPage)
    .skip((page - 1) * perPage);
  return res.json({
    books,
    pages,
    currentPage: page,
    hasPrevious: page !== 1,
    hasNext: page !== totalPages,
  });
};

exports.list = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 20;
  const count = await Book.countDocuments();
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
  const books = await Book.find()
    .skip((page - 1) * perPage)
    .limit(perPage);
  return res.json({
    books,
    pages,
    currentPage: page,
    hasPrevious: page !== 1,
    hasNext: page !== totalPages,
  });
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  await Book.deleteOne({ _id: id });
  return res.json({
    success: true,
  });
};

exports.get = async (req, res) => {
  const id = req.params.id;
  const book = await Book.findOne({ _id: id });
  return res.json({
    book,
    success: true,
  });
};

exports.postCreate = (req, res) => {
  const path = req.file.path;
  cloudinary.uploader.upload(path, async (error, result) => {
    const body = req.body;
    const title = body.title;
    const description = body.description;
    
    if (error) {
      return res.status(400).json({
        errors: [error.message],
      });
    }

    const coverUrl = result.secure_url;
    await Book.create({
      coverUrl,
      title,
      description,
    });
    return res.json({
      success: true,
    });
  });
};

exports.postUpdate = async (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  await Book.updateOne({ _id: id }, { title });
  return res.json({
    success: true,
  });
};
