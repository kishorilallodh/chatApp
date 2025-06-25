const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  image: String // URL of profile picture
});

module.exports = mongoose.model('User', userSchema);
