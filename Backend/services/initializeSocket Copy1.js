// socketService.js
const { Server } = require('socket.io');

// Initialize Socket.IO with server instance
const initializeSocket = (server) => {
  // Configure CORS for Socket.IO
  const io = new Server(server, {
    cors: {
      origin: '*', // In production, specify your frontend domain
      methods: ['GET', 'POST']
    }
  });

  // Store rooms and their users
  const rooms = new Map();

  // Socket.IO connection handler
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    let currentRoom = null;
    let currentUser = null;

    // Join room
    socket.on('join-room', ({ roomId, user }) => {
      // Leave previous room if any
      if (currentRoom) {
        socket.leave(currentRoom);
        rooms.get(currentRoom).delete(currentUser);
        io.to(currentRoom).emit('user-left' , user.fullname);
        // if (rooms[currentRoom]) {
        //userleft notify end usercount decrese notify 
        //   io.to(currentRoom).emit('user-left', { id: socket.id, username });
        // }
      }

      // Initialize room if not exists
     //   if (!rooms[roomId]) {
     //     rooms[roomId] = {
     //       users: [],
     //       codeContent: "// Write your code here...",
     //       language: "javascript"
    //     };
     //   }

      // Join new room
      currentRoom = roomId;
      currentUser = user._id;
      socket.join(roomId);

      
     if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }

      rooms.get(roomId).add(user._id);


      // Add user to room
    //   const userData = {
    //     id: socket.id,
    //     name: user.name,
    //     avatar: user.avatar || '/avatars/default.png',
    //     isHost: rooms[roomId].users.length === 0, // First user becomes host
    //     isActive: true
    //   };
    //   rooms[roomId].users.push(userData);

      // Notify others in room
      socket.to(roomId).emit('user-joined', Array.from(rooms.get(currentRoom)));
      
      // Send room state to the new user
    //   socket.emit('room-state', {
    //     users: rooms[roomId].users,
    //     codeContent: rooms[roomId].codeContent,
    //     language: rooms[roomId].language
    //   });
      
      // 
      console.log(`${user.fullname} joined room: ${roomId}`);
    });

    // Code change event
    socket.on('code-change', ({ roomId, code }) => {
        socket.to(roomId).emit("code-update", code);
        
    //   if (rooms[roomId]) {
    //     rooms[roomId].codeContent = code;
    //     socket.to(roomId).emit('code-update', { code, userId: socket.id });
    //   }
    });

    // Language change event notify others
    socket.on('language-change', ({ roomId, language }) => {
        socket.to(roomId).emit("language-update", language);
    //   if (rooms[roomId]) {
    //     rooms[roomId].language = language;
    //     socket.to(roomId).emit('language-update', { language, userId: socket.id });
    //   }
    });

    // Typing indicator
    socket.on('typing', ({ roomId  , user}) => {
        socket.to(roomId).emit("user-typing", user.fullname);
    //   if (currentRoom === roomId) {
    //     socket.to(roomId).emit('user-typing', { userId: socket.id, username });
    //   }
    });

    // Stop typing indicator
    // socket.on('stop-typing', ({ roomId , user }) => {
    //   if (currentRoom === roomId) {
    //     socket.to(roomId).emit('user-stop-typing', user.fullname);
    //   }
    // });

    // Send chat message
    socket.on('send-message', ({ roomId, message, user }) => {

        const messageData={      
            message:message,
            sender:user,
            time:new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),

        };
        socket.to(roomId).emit('new-message' , messageData);
        //   if (rooms[roomId]) {
        //     const messageData = {
        //       id: Date.now(),
        //       sender: username,
        //       senderId: socket.id,
        //       message,
        //       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        //     };
        //     io.to(roomId).emit('new-message', messageData);
        //   }
    });
    
    socket.on("leave-room", () => {
        if (currentRoom && currentUser) {
          rooms.get(currentRoom).delete(currentUser);
          io.to(currentRoom).emit("user-left", Array.from(rooms.get(currentRoom)));
    
          socket.leave(currentRoom);
    
          currentRoom = null;
          currentUser = null;
        }
      });

    // Handle disconnection
    socket.on('disconnect', (user) => {
      console.log(`User disconnected: ${socket.id} ,  user:  ${user.fullname}`);
      
      if (currentRoom && currentUser) {

        rooms.get(currentRoom).delete(currentUser);
        io.to(currentRoom).emit("user-left", Array.from(rooms.get(currentRoom)));

        if(rooms.get(currentRoom).length === 0 ){
            rooms.delete(currentRoom);
            console.log(`Room ${currentRoom} removed (empty)`);
            currentRoom = null;
            currentUser = null;
        }
        // Remove user from room
        // rooms[currentRoom].users = rooms[currentRoom].users.filter(u => u.id !== socket.id);
        
        // // Notify others
        // io.to(currentRoom).emit('user-left', { id: socket.id, username });
        // io.to(currentRoom).emit('user-count', rooms[currentRoom].users.length);
        
        // // Clean up empty rooms
        // if (rooms[currentRoom].users.length === 0) {
        //   delete rooms[currentRoom];
        //   console.log(`Room ${currentRoom} removed (empty)`);
        // } else {
        //   // Assign a new host if the host left
        //   const needNewHost = !rooms[currentRoom].users.some(u => u.isHost);
        //   if (needNewHost && rooms[currentRoom].users.length > 0) {
        //     rooms[currentRoom].users[0].isHost = true;
        //     io.to(currentRoom).emit('new-host', { userId: rooms[currentRoom].users[0].id });
        //   }
        // }
      }
    });
  });

  return io;
};

module.exports = { initializeSocket };