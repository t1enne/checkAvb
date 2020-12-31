const socketio = require('socket.io')

function init(server) {
  const io = socketio(server, {
    withCredentials: true,
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  })

  io.on('connection', socket => {
    io.emit('message-client-connected', `Client with id ${socket.id} was connected`)

    socket.on('input', item => {
      //item has id, field and value
      io.emit(`remote-input`, item)
    })

  });

}


module.exports = init