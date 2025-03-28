// roomManager.js
const globalRooms = new Map(); // Stores active rooms

const createRoom = (roomId, hostUser) => {

  if (!hostUser || !hostUser._id || !hostUser.fullname) {
    return false;
  }
  if (!globalRooms.has(roomId)) {
    globalRooms.set(roomId, {
      host: hostUser,
      code: '', // Initial empty code
      language: 'javascript', // Default language
      messages: [],
      blockedUsers: new Set(),
      participants: new Map(),
      createdAt: new Date(),
    });
    return true;
  }
  return false; // Room already exists
};

const getRoomState = (roomId) => {
  return globalRooms.get(roomId) || null;
};

const doesRoomExist = (roomId) => {
  return globalRooms.has(roomId);
};

const handleRoomAccess = (req , res) => {
  try {
    const { roomId } = req.params;
    const { user } = req.query;

    // Check if room exists
    const room = globalRooms.get(roomId);
    if (!room) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Room does not exist.' 
      });
    }
    // Check if user is in the room
    // const userInRoom = room.participants.p => p.toString() === userId);

    // Check if user is blocked
    if (room.blockedUsers.has(user._id)) {
      return res.status(403).json({ 
        status: 'error', 
        message: 'You have been blocked from this room.' 
      });
    }

    // Successful room access
   
    return res.status(200).json({ 
      status: 'success', 
      message: `Welcome to room ${user?.fullname}!`,
      host: room.host,
    });

  } catch (error) {
   return res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error accessing room.' 
    });
};
}

module.exports = { globalRooms, createRoom, getRoomState, doesRoomExist  , handleRoomAccess};
