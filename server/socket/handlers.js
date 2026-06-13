// socket/handlers.js
const activeMeetings = new Map();
const userSockets = new Map();

export function setupSocketHandlers(socket, io) {
  // Join meeting
  socket.on('join-meeting', (data) => {
    const { meetingId, userId, userName, profileImage } = data;

    // Join socket room
    socket.join(`meeting-${meetingId}`);
    userSockets.set(socket.id, { userId, userName, meetingId, profileImage });

    // Track active meetings
    if (!activeMeetings.has(meetingId)) {
      activeMeetings.set(meetingId, []);
    }
    activeMeetings.get(meetingId).push({
      socketId: socket.id,
      userId,
      userName,
      profileImage,   // store profileImage
    });

    // Notify others
    socket.broadcast.to(`meeting-${meetingId}`).emit('participant-joined', {
      participantId: socket.id,
      userId,
      userName,
      profileImage,   // send profileImage
    });

    // Send current participants to new user (including profile images)
    const participants = activeMeetings.get(meetingId) || [];
    socket.emit('participants-list', {
      participants: participants.map((p) => ({
        socketId: p.socketId,
        userId: p.userId,
        userName: p.userName,
        profileImage: p.profileImage,   // include profileImage
      })),
    });
  });

  // WebRTC Offer
  socket.on('offer', (data) => {
    const { to, offer } = data;
    io.to(to).emit('offer', {
      from: socket.id,
      offer,
    });
  });

  // WebRTC Answer
  socket.on('answer', (data) => {
    const { to, answer } = data;
    io.to(to).emit('answer', {
      from: socket.id,
      answer,
    });
  });

  // ICE Candidate
  socket.on('ice-candidate', (data) => {
    const { to, candidate } = data;
    io.to(to).emit('ice-candidate', {
      from: socket.id,
      candidate,
    });
  });

  // Add comment
  socket.on('comment-added', (data) => {
    const { meetingId, comment } = data;
    socket.broadcast.to(`meeting-${meetingId}`).emit('comment-added', comment);
  });

  // Participant muted
  socket.on('participant-muted', (data) => {
    const { meetingId, participantId, isMuted } = data;
    io.to(`meeting-${meetingId}`).emit('participant-muted', {
      participantId,
      isMuted,
    });
  });

  // Screen share
  socket.on('screen-share-started', (data) => {
    const { meetingId } = data;
    const user = userSockets.get(socket.id);
    socket.broadcast.to(`meeting-${meetingId}`).emit('screen-share-started', {
      userId: user?.userId,
      userName: user?.userName,
    });
  });

  socket.on('screen-share-ended', (data) => {
    const { meetingId } = data;
    socket.broadcast.to(`meeting-${meetingId}`).emit('screen-share-ended');
  });

  // Leave meeting
  socket.on('leave-meeting', (data) => {
    const { meetingId, userId } = data;
    const meetings = activeMeetings.get(meetingId) || [];
    const idx = meetings.findIndex((p) => p.socketId === socket.id);
    if (idx !== -1) {
      meetings.splice(idx, 1);
    }

    socket.leave(`meeting-${meetingId}`);
    socket.broadcast.to(`meeting-${meetingId}`).emit('participant-left', {
      participantId: socket.id,
      userId,
    });

    userSockets.delete(socket.id);
  });

  // Disconnect
  socket.on('disconnect', () => {
    const user = userSockets.get(socket.id);
    if (user) {
      const { meetingId } = user;
      const meetings = activeMeetings.get(meetingId) || [];
      const idx = meetings.findIndex((p) => p.socketId === socket.id);
      if (idx !== -1) {
        meetings.splice(idx, 1);
      }

      io.to(`meeting-${meetingId}`).emit('participant-left', {
        participantId: socket.id,
      });

      if (meetings.length === 0) {
        activeMeetings.delete(meetingId);
      }
    }

    userSockets.delete(socket.id);
    console.log('User disconnected:', socket.id);
  });

  // Ping/Pong for keeping connection alive
  socket.on('ping', () => {
    socket.emit('pong');
  });
}