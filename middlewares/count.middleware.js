let count = 0;
exports.count = (req, res, next) => {
  if (req.cookies) {
    count += 1;
  }
  next();  
};
