require('dotenv').config();

const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(sessionMiddleware);

app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect('/auth/login');
});

app.use('/users', csrf({ cookie: true }), authMiddleware.requireAuth, userRoute);
app.use('/books', csrf({ cookie: true }), bookRoute);
app.use('/transactions', csrf({ cookie: true }), authMiddleware.requireAuth, transactionRoute);
app.use('/auth', authRoute);
app.use('/cart', cartRoute);

app.use('/api', authApiRoute);
app.use('/api/transactions', transactionApiRoute);
app.use('/api/books', bookApiRoute);
app.use('/api/carts', cartApiRoute);

app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).render('common/error');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
