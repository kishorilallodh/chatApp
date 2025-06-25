require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const Message = require('./modules/Message'); // updated model with from, to, message
const userRoutes = require('./routes/userRoutes');
const homeRoutes = require('./routes/homeRoute');

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// EJS setup
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Routes
app.use('/', userRoutes);
app.use('/', homeRoutes);

// ---------------- Socket.IO Private Chat Logic ----------------
io.on('connection', (socket) => {
  console.log('A user connected');

  // Load chat history between two users
  socket.on('loadPrivateMessages', async ({ from, to }) => {
    try {
      const messages = await Message.find({
        $or: [
          { from, to },
          { from: to, to: from }
        ]
      }).sort({ timestamp: 1 });

      messages.forEach(msg => {
        socket.emit('chatMessage', {
          user: msg.from,
          message: msg.message,
          time: new Date(msg.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })
        });
      });
    } catch (err) {
      console.error('Error loading private messages:', err);
    }
  });

  // Handle sending new private message
  socket.on('privateMessage', async ({ from, to, message }) => {
    try {
      const newMessage = new Message({ from, to, message });
      await newMessage.save();

      // Broadcast message to all clients — optionally, limit to only `from` and `to` later
      io.emit('chatMessage', {
        user: from,
        message,
        time: new Date(newMessage.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      });
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
