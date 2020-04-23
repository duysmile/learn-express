exports.postCreate = (req, res, next) => {
  const name = req.body.name;
  const errors = [];
  if (!name) {
    errors.push('Name is required.');
  }
  if (name.length >= 30) {
    errors.push('Name must be less than 30 characters.');
  }
  
  if (errors.length) {
    return res.render('user/create', {
      errors,
    });
  }
  next();
};
