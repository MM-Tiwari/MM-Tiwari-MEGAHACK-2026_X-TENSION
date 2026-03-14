require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Route Files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const oracleRoutes = require('./routes/oracleRoutes');
const requestRoutes = require('./routes/requestRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Models
const Message = require('./models/Message');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes); // Legacy matches
app.use('/api/oracle-matches', oracleRoutes); // NEW Oracle Match
app.use('/api/requests', requestRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => res.send('🚀 SkillSwap Oracle API is live...'));

// Socket.io Real-time Logic
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('⚡ Client connected');

  socket.on('join', async (userId) => {
    socket.join(userId);
    onlineUsers.set(userId, socket.id);
    
    // Update online status in DB
    await User.findByIdAndUpdate(userId, { onlineStatus: true });
    io.emit('userStatusChange', { userId, status: 'online' });
    console.log(`👤 User ${userId} is online`);
  });

  socket.on('typing', (data) => {
    // data: { senderId, receiverId, isTyping }
    io.to(data.receiverId).emit('displayTyping', { 
      userId: data.senderId, 
      isTyping: data.isTyping 
    });
  });

  socket.on('sendMessage', async (data) => {
    const { sender, receiver, message } = data;
    try {
      const newMessage = await Message.create({ sender, receiver, message });
      io.to(receiver).emit('receiveMessage', newMessage);
      io.to(sender).emit('messageSent', newMessage);
      
      // Live Credit Update Trigger (Simulation for demo if needed)
      // io.to(sender).emit('creditUpdate', { newCredits: credits });
    } catch (err) {
      console.error('❌ Socket Error:', err);
    }
  });

  socket.on('disconnect', async () => {
    let disconnectedUserId = null;
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        break;
      }
    }
    
    if (disconnectedUserId) {
      onlineUsers.delete(disconnectedUserId);
      await User.findByIdAndUpdate(disconnectedUserId, { onlineStatus: false });
      io.emit('userStatusChange', { userId: disconnectedUserId, status: 'offline' });
      console.log(`👋 User ${disconnectedUserId} went offline`);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 SkillSwap Oracle running on port ${PORT}`));
