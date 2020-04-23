const express = require("express");
const app = express();

const userRoute = require('./routes/user.route');
const bookRoute =require('./routes/book.route');
const transactionRoute = require('./routes/transaction.route');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect('/books');
});

app.use('/users', userRoute);
app.use('/books', bookRoute);
app.use('/transactions', transactionRoute);

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
