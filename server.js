const { instrument } = require('@socket.io/admin-ui');
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = express()
  .use((req, res) => res.sendFile(path.resolve(process.cwd(), 'client', 'dist', 'index.html')))
  .listen(PORT, () => console.log(`Server started at port ${PORT}`));

const io = socketIO(server, {
  cors: {
    origin: ['http://localhost:8081', 'https://admin.socket.io' , 'https://global-chat-socket.herokuapp.com/']
  }
});

io.on('connection', socket => {

  socket.on('send-message', (message, userName, room) => {
    if(room === '') {
      socket.broadcast.emit('revieve-message', message, userName);
    } else {
      socket.to(room).emit('revieve-message', message, userName);
    }
  });

  socket.on('join-room', (room, callback) => {
    socket.join(room);
    callback(`Joined room ${room}`);
  });
})

instrument(io, {auth: false});

