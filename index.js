// Import dependencies
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// Create the Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the "public" folder
app.use(express.static('public'));

// Store connected users
const users = {};

// Socket.io event handling
io.on('connection', (socket) => {
  // Event when a new user connects
  socket.on('newUser', (username) => {
    users[socket.id] = username;
    socket.broadcast.emit('userConnected', username);
  });

  // Event when a user sends a message
  socket.on('chatMessage', (message) => {
    const username = users[socket.id];
    socket.broadcast.emit('chatMessage', { username, message });
  });

  // Event when a user disconnects
  socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    socket.broadcast.emit('userDisconnected', username);
  });
});

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
