const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const shortid = require('shortid');
const db = low(adapter);

db.defaults({books: [], users: [], transactions: [], sessions: []}).write();

const Book = db.get('books');
const User = db.get('users');
const Transaction = db.get('transactions');
const Session = db.get('sessions');

module.exports = {
  Book,
  User,
  Transaction,
  Session,
};
