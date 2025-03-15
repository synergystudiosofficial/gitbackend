const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

module.exports = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: ['http://localhost:3001'],  // Updated to use 3001
      methods: ['GET', 'POST'],
      credentials: true
    }
  });
  
  // Authentication middleware for Socket.IO
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded.user;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });
  
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id}`);
    
    // Join a room specific to this user
    socket.join(`user:${socket.user.id}`);
    
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });
  
  return {
    io,
    // Function to emit a new notification
    emitNotification: (userId, notification) => {
      io.to(`user:${userId}`).emit('notification', notification);
    }
  };
};