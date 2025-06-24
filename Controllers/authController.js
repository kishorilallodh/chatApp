const User = require('../modules/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getRegister = (req, res) => {
  res.render('register');
};

exports.postRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.send('Registration Failed');
  }
};

exports.getLogin = (req, res) => {
  res.render('login');
};



exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.send('User not found');

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.send('Invalid credentials');

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.cookie('token', token, {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000  // valid for 1 day
});

    res.redirect('/chat');
  } catch (err) {
    console.error(err);
    res.send('Login Failed');
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};
