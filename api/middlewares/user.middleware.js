exports.postCreate = (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;
  const errors = [];
  if (!name) {
    errors.push('Name is required.');
  }
  if (!email) {
    errors.push('Email is required.');
  }
  if (!password) {
    errors.push('Password is required.');
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
