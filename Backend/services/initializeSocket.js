const { Server } = require("socket.io");
const { globalRooms } = require("../controllers/roomManager");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173", // Explicitly list allowed origin
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"], // Explicitly specify transports
  });
  // const io = new Server(server, {
  //   cors: {
  //     origin: "http://localhost:5173", // Explicitly list allowed origin
  //     methods: ["GET", "POST"],
  //     credentials: true, // Required if using cookies/auth
  //     allowedHeaders: ["Content-Type", "Authorization"],
  //   },

  //   transports: ["websocket", "polling"], // Explicitly specify transports
  //   connectionStateRecovery: {
  //     maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
  //   },
  //   path: "/socket.io",
  //   serveClient: false,
  //   pingTimeout: 60000, // 60 seconds
  //   pingInterval: 25000, // 25 seconds
  //   cookie: false,
  // });

  // Store rooms and users
  // const rooms = new Map(); // { roomId: Map<userId, userData> }

  // Helper function to get users in a room
  const getUsersInRoom = (roomId) => {
    const room = globalRooms.get(roomId);
    return room ? [...room.participants.values()] : []; //send the user object
  };

  // Debug helper to log room state
  const logRoomState = (roomId) => {
    const room = globalRooms.get(roomId);
    // console.log(
    //   `Room ${roomId} state:`,
    //   room
    //     ? `Users: ${room.participants.size}, Names: ${JSON.stringify(
    //         [...room.participants.values()].map((u) => u.fullname)
    //       )}`
    //     : "Room does not exist"
    // );
  };

  // Add error handling for the entire Socket.IO server
  io.engine.on("connection_error", (err) => {
    // console.error("Socket.IO Connection Error:", {
    //   code: err.code,
    //   message: err.message,
    //   context: err.context,
    // });
  });

  // Optional: Add a general error handler
  io.use((socket, next) => {
    socket.on("error", (error) => {
      // console.error("Socket Error:", error);
    });
    next();
  });

  io.on("connection", (socket) => {
    // console.log(`User connected: ${socket.id}`);
    // console.log("Global Rooms:", globalRooms);

    // Add connection-specific error handling
    socket.on("connect_error", (err) => {
      // console.error(`Socket connection error for ${socket.id}:`, err.message);
    });

    // Track user state
    let currentRoom = null;
    let currentUserId = null;
    let currentUser = null;

    socket.on("join-room", ({ roomId, user }) => {
      // console.log(
      //   `Join room request: ${user.fullname} (${user._id}) to room ${roomId}`
      // );
      if (currentRoom === roomId) {
        // console.log(`User ${user.fullname} is already in room ${roomId}`);
        return;
      }
      // Leave current room if in one
      if (currentRoom) {
        // console.log(
        //   `User ${user.fullname} is leaving room ${currentRoom} before joining ${roomId}`
        // );

        // Check if the room still exists
        if (globalRooms.has(currentRoom)) {
          const userData = globalRooms
            .get(currentRoom)
            .participants.get(currentUserId); //previous room
          const prevRoomHost = globalRooms.get(currentRoom).host._id;

          if (userData) {
            //current user has any previous room
            if (userData._id === prevRoomHost) {
              // console.log(
              //   `Host ${user.fullname} is leaving room ${currentRoom}, closing room`
              // );
              io.to(currentRoom).emit("room-closed");
              globalRooms.delete(currentRoom);
            } else {
              // console.log(
              //   `User ${user.fullname} is leaving room ${currentRoom}`
              // );
              globalRooms.get(currentRoom).participants.delete(currentUserId);
              io.to(currentRoom).emit("user-left", {
                user: currentUser,
                roomUsers: getUsersInRoom(currentRoom),
              });
            }
          }
        }

        socket.leave(currentRoom);
      }

      // Join new room
      currentRoom = roomId;
      currentUserId = user._id;
      currentUser = user;

      // Create room if it doesn't exist
      if (!globalRooms.has(roomId)) {
        // done at host page
        // console.log(`there is no Room with this id: ${roomId}`);
        return;
      }

      // Add user to room
      globalRooms.get(roomId).participants.set(user._id, user);
      socket.join(currentRoom);

      // After adding user to room
      socket.emit("room-state", {
        roomUsers: getUsersInRoom(roomId),
        code: globalRooms.get(roomId).code,
        messages: globalRooms.get(roomId).messages,
        language: globalRooms.get(roomId).language,
        isHost: user._id === globalRooms.get(roomId).host._id,
      });

      // Then notify others
      socket.to(roomId).emit("user-joined", {
        user: currentUser,
        roomUsers: getUsersInRoom(roomId),
      });

      // console.log(
      //   `${user.fullname} joined room: ${roomId} as ${
      //     currentUser.isHost ? "host" : "participant"
      //   }`
      // );
      logRoomState(roomId);
    });

    socket.on("code-change", ({ roomId, code }) => {
      // console.log(
      //   `Code change in room ${roomId} by ${currentUser?.fullname || "Unknown"}`
      // );
      globalRooms.get(roomId).code = code;
      // console.log("backedn the code comes from frontedn is \n", code);
      socket.to(roomId).emit("code-update", code);
    });

    socket.on("language-change", ({ roomId, language }) => {
      // console.log(
      //   `Language changed to ${language} in room ${roomId} by ${
      //     currentUser?.fullname || "Unknown"
      //   }`
      // );
      globalRooms.get(roomId).language = language;
      socket.to(roomId).emit("language-update", language);
    });

    socket.on("typing", ({ roomId }) => {
      if (currentUser) {
        // console.log(`${currentUser.fullname} is typing in room ${roomId}`);
        socket.to(roomId).emit("user-typing", currentUser.fullname);
      }
    });

    socket.on("update-messages", ({ roomId, messageData }) => {
      
      // console.log(
      //   `New message in room ${roomId} from ${
      //     currentUser?.fullname || "Unknown"
      //   }: ${messageData}`
      // );

      globalRooms.get(roomId).messages.push(messageData);
      io.to(roomId).emit("new-message", globalRooms.get(roomId).messages); // sending the array of messages
    });

    socket.on("host-block-user", ({ roomId, user }) => {
      const room = globalRooms.get(roomId);
      if (room) {
        room.blockedUsers.add(user._id);
        // room.participants.delete(userId);

        // Notify other participants about user removal including blocked user and pass the userID of that user aswell
        io.to(roomId).emit("user-blocked", { user });
      }
    });

    socket.on("leave-room", () => {
      if (!currentRoom) {
        // console.log(
        //   `Leave room event received but user ${socket.id} is not in a room`
        // );
        return;
      }

      if (!globalRooms.has(currentRoom)) {
        // console.log(
        //   `Leave room event received but room ${currentRoom} doesn't exist`
        // );
        return;
      }

      const room = globalRooms.get(currentRoom);
      if (!room.participants.has(currentUserId)) {
        // console.log(
        //   `Leave room event received but user ${currentUserId} not found in room ${currentRoom}`
        // );
        return;
      }

      const userData = room.participants.get(currentUserId);
      // console.log(
      //   `User ${userData.fullname} is leaving room ${currentRoom} voluntarily`
      // );

      if (currentUser.isHost) {
        // console.log(
        //   `Host ${userData.fullname} is leaving room ${currentRoom}, closing room`
        // );
        io.to(currentRoom).emit("room-closed");
        globalRooms.delete(currentRoom);
      } else {
        room.participants.delete(currentUserId); // room is defined above
        io.to(currentRoom).emit("user-left", {
          user: userData,
          roomUsers: getUsersInRoom(currentRoom),
        });

        // Clean up empty rooms
        if (room.participants.size === 0) {
          // console.log(`Room ${currentRoom} is now empty, removing it`);
          globalRooms.delete(currentRoom);
        }
      }

      socket.leave(currentRoom);
      currentRoom = null;
      currentUserId = null;
      currentUser = null;
    });

    socket.on("disconnect", () => {
      // console.log(
      //   `User disconnected: ${socket.id}, user: ${
      //     currentUser?.fullname || "Unknown"
      //   }`
      // );

      if (currentRoom && currentUserId && globalRooms.has(currentRoom)) {
        const room = globalRooms.get(currentRoom);
        const userData = room.participants.get(currentUserId);

        if (userData) {
          // console.log(
          //   `${userData.fullname} disconnected from room ${currentRoom}`
          // );

          if (currentUser.isHost) {
            // console.log(
            //   `Host ${userData.fullname} disconnected from room ${currentRoom}, closing room`
            // );
            io.to(currentRoom).emit("room-closed", {
              hostName: userData.fullname,
            });
            globalRooms.delete(currentRoom);
          } else {
            room.participants.delete(currentUserId);
            io.to(currentRoom).emit("user-left", {
              user: userData,
              roomUsers: getUsersInRoom(currentRoom),
            });

            // Clean up empty rooms
            if (room.size === 0) {
              // console.log(`Room ${currentRoom} is now empty, removing it`);
              globalRooms.delete(currentRoom);
            }
          }
        }
      }
    });
  });

  // Optional: Global error handling
  io.on("error", (error) => {
    // console.error("Unhandled Socket.IO Error:", error);
  });
  // Log current state of all rooms every 5 minutes
  setInterval(() => {
    // console.log(`Active rooms: ${globalRooms.size}`);
    globalRooms.forEach((room, roomId) => {
      // console.log(`Room ${roomId}: ${room.participants.size} users`);
    });
  }, 5 * 60 * 1000);

  return io;
};

module.exports = { initializeSocket };
