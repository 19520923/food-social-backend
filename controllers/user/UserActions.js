const User = require("../../models/User")
const CreateNotification = require("../../utils/CreateNotification")

exports.followUser = async (req, res) => {
    try {

        const user_receiver = await User.findById(req.params.user_id)
        const user_send = await User.findById(req.userId)

        if(!user_receiver){
            return res.status(404).json({
                error: 'User not found'
            })
        }

        if (req.userId == req.params.user_id) {
            return res
              .status(400)
              .json({ error: 'You cannot send friend request to yourself' })
        }

        if (user_send.following.includes(req.params.user_id)) {
            return res.status(400).json({ error: 'Already following' })
        }

        user_send.following.push(user_receiver)
        await user_send.save()

        user_receiver.follower.push(user_send)
        await user_receiver.save()

        let notification = await CreateNotification({
            author: user_send,
            receiver: user_receiver,
            type: 'FOLLOW',
            destination: user_send.id,
            content: `${user_send.username} has been following you`
        })

        if(user_receiver.socket_id) {
            req.io
                .to(user_receiver.socket_id)
                .emit('follow-request-status', {sender: FilterUserData(user_send)})

            req.io
                .to(user_receiver.socket_id)
                .emit('notification', {data: notification})
        }

        return res.status(200).json({
            message: 'follow successfully',
            notification: notification
        })

    } catch (err){
        console.log(err)
        return res.status(500).json({error: 'Something went wrong'})
    }
}


exports.seenNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.notification_id)

        if(!notification){
            return res.status(404).json({error : 'Not found'})
        }

        if (notification.is_seen){
            return res.status(400).json({error : 'Already seen'})
        }

        notification.is_seen = true
        await notification.save()

        return res.status(200).json({message: "already seen"})
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: 'Something went wrong'})
    }
}
