const User = require("../../models/User")
const CreateNotification = require('../CreateNotification')

module.exports = async ({req, res, key, notify_content, notify_type, data, destination, food_data, post_data}) => {
    const follower = await User.findById(req.userId).populate('follower')

    follower.follower.forEach(async user => {

        if(notify_content){
            let notification = await CreateNotification({
                author: follower.id,
                content: notify_content,
                receiver: user.id,
                type: notify_type,
                destination: destination,
                food_data: food_data,
                post_data: post_data,
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