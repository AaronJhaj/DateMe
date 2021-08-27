const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  gender:{
    type: String
  },

  sexPref:{
    type: String
  },

  age:{
    type: String
  },

  q1:{
    type: String
  },
  q2:{
    type: String
  },
  q3:{
    type: String
  },
  q4:{
    type: String
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;