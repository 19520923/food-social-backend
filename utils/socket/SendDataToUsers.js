const User = require("../../models/User")
const CreateNotification = require('../CreateNotification')

module.exports = async ({req, res, key, notify_content, notify_type, data, destination}) => {
    const users = await User.find({})

    users.forEach(async user => {

        if(notify_content){
            let notification = await CreateNotification({
                author: follower,
                content: notify_content,
                receiver: user,
                type: notify_type,
                destination: destination,
            })
            if(user.socket_id){
                req.io.to(user.socket_id).emit("notification", {data:notification})
            }
        }
            if(user.socket_id){
                req.io.to(user.socket_id).emit(key, {data})
            }
    })
}   