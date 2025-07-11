const jwt = require('jsonwebtoken');
const User = require('../modules/User');

exports.getChatPage = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.userId);
    const allUsers = await User.find();

    res.render('chat', {
      username: currentUser.username,
      users: allUsers,
      encryptionKey: process.env.ENCRYPTION_KEY
    });
  } catch (err) {
    console.error('Error loading chat page:', JSON.stringify(err, null, 2));
    res.redirect('/login');
  }
};
