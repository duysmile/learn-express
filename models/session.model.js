const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  cart: {
    type: Map,
    of: Number,
  },
});

const Session = mongoose.model('Session', sessionSchema, 'sessions');

module.exports = Session;
