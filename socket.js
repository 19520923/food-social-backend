const User = require('./models/User')
const jwt = require('jsonwebtoken')

module.exports = (io) => {
  try {

    io.on('connection', (socket) => {
      if (io.req) {
        socket.broadcast.emit('friend-login-status', { user_id: io.req.userId })
        addSocketIdInDB(socket.id, io.req.userId)

        socket.on('disconnect', () => {
          socket.broadcast.emit('friend-logout-status', {
            user_id: io.req.userId,
          })
          io.req.userId = null
        })
      }
    })
  } catch (err) {
    console.log(err);
  }
}

async function addSocketIdInDB(socket_id, user_id) {
  try {
    const user = await User.findById(user_id)
    if (socket_id) {
      user.socket_id = socket_id
      await user.save()
    }
  } catch (err) {
    console.log(err);
  }
}