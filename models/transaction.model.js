const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  user: {
    _id: mongoose.SchemaTypes.ObjectId,
    name: String,
  },
  book: {
    _id: mongoose.SchemaTypes.ObjectId,
    title: String,
  },
  isComplete: Boolean,
  count: Number,
});

const Transaction = mongoose.model('Transaction', transactionSchema, 'transactions');

module.exports = Transaction;
