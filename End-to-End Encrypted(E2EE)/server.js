const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  // Join a room
  socket.on('join', (room) => {
    socket.join(room);
    console.log(`${socket.id} joined ${room}`);
    // notify others
    socket.to(room).emit('peer-joined', { id: socket.id });
  });

  // Relay public key to room (server does not inspect contents)
  socket.on('public-key', ({ room, jwk, username }) => {
    // forward to others in the room
    socket.to(room).emit('public-key', { jwk, from: socket.id, username });
  });

  // Relay encrypted message to room
  socket.on('encrypted-message', ({ room, payload }) => {
    // payload contains: iv (base64), cipher (base64), fromUsername
    socket.to(room).emit('encrypted-message', { payload, from: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('disconnect', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
