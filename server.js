require('dotenv').config();

const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/user.route');
const bookRoute =require('./routes/book.route');
const transactionRoute = require('./routes/transaction.route');
const authRoute = require('./routes/auth.route');
const countMiddleware = require('./middlewares/count.middleware');
const authMiddleware = require('./middlewares/auth.middleware');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(countMiddleware.count);

app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect('/auth/login');
});

app.use('/users', authMiddleware.requireAuth, userRoute);
app.use('/books', bookRoute);
app.use('/transactions', authMiddleware.requireAuth, transactionRoute);
app.use('/auth', authRoute);

// listen for requests :)
const listener = app.listen(3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
