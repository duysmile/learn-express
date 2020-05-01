require('dotenv').config();

const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const mongoose = require('mongoose');
// mongoose.connect(process.env.MONGO_CONNECTION, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const userRoute = require('./routes/user.route');
const bookRoute = require('./routes/book.route');
const transactionRoute = require('./routes/transaction.route');
const authRoute = require('./routes/auth.route');
const cartRoute = require('./routes/cart.route');

const authApiRoute = require('./api/routes/auth.route');
const transactionApiRoute = require('./api/routes/transaction.route');
const bookApiRoute = require('./api/routes/book.route');
const cartApiRoute = require('./api/routes/cart.route');

const authMiddleware = require('./middlewares/auth.middleware');
const sessionMiddleware = require('./middlewares/session.middleware');

app.get('/', (req, res) => {
  res.send('ok');
})

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
