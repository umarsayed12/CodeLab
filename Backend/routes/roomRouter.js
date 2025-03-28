const express = require('express');
const router = express.Router();
const { globalRooms  , createRoom , handleRoomAccess} = require('../controllers/roomManager.js');


router.get('/:roomId', handleRoomAccess)
.post('/create-room', createRoomHandler);

function createRoomHandler(req, res) {
    const { meetingName,hostName,roomId,host} = req.body;
    
    if (!meetingName.trim() || !hostName.trim() || !roomId.trim() || !host) {
          return res.status(400).json({ 
            status: 'error', 
            message: 'All fields are required before generating a room ID.' 
          });
        }
        if (createRoom(roomId, host)) {
            // console.log("Backend room Created",{meetingName,hostName,roomId,host});
        return res.status(201).json({ status: 'success', message: 'Room created successfully.' });
    }
    return res.status(400).json({ status: 'error', message: 'Room already exists.' });
}
module.exports = router;