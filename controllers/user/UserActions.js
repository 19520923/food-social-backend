const User = require("../../models/User")
const CreateNotification = require("../../utils/CreateNotification")

exports.followUser = async (req, res) => {
    try {

        const user_receiver = await User.findById(req.params.user_id)
        const user_send = await User.findById(req.userId)

        if (!user_receiver) {
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
            author: user_send.id,
            receiver: user_receiver.id,
            type: 'FOLLOW',
            destination: user_send.id,
            content: `${user_send.username} has been following you`
        })

        if (user_receiver.socket_id) {
            req.io
                .to(user_receiver.socket_id)
                .emit('follow-request-status', { sender: user_send })

            req.io
                .to(user_receiver.socket_id)
                .emit('notification', { data: notification })
        }

        const user_data = await User.findById(req.userId).populate('following').populate('follower')

        return res.status(200).json({
            message: 'follow successfully',
            data: user_data
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

exports.unFollow = async (req, res) => {
    try {

        const user_receiver = await User.findById(req.params.user_id)
        const user_send = await User.findById(req.userId)

        if (!user_receiver) {
            return res.status(404).json({
                error: 'User not found'
            })
        }

        if (req.userId == req.params.user_id) {
            return res
                .status(400)
                .json({ error: 'You cannot unfollow yourself' })
        }

        if (!user_send.following.includes(req.params.user_id)) {
            return res.status(400).json({ error: 'Already unfollowing' })
        }

        user_send.following = user_send.following.filter(f => f != req.params.user_id)
        await user_send.save()
        user_receiver.follower = user_receiver.follower.filter(f => f != req.userId)
        await user_receiver.save()

        const user_data = await User.findById(req.userId).populate('following').populate('follower')

        return res.status(200).json({
            message: 'unfollow successfully',
            data: user_data
        })
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' })
    }

}


exports.seenNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.notification_id)

        if (!notification) {
            return res.status(404).json({ error: 'Not found' })
        }

        if (notification.is_seen) {
            return res.status(400).json({ error: 'Already seen' })
        }

        notification.is_seen = true
        await notification.save()

        return res.status(200).json({ message: "already seen" })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}


exports.updateCoverPic = async (req, res) => {
    try {
        const { cover_url } = req.body
        const user = await User.findById(req.userId)
        user.cover_url = cover_url
        await user.save()

        return res.status(200).json({
            message: 'cover picture updated'
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

exports.updateAvatarPic = async (req, res) => {
    try {
        const { avatar_url } = req.body
        const user = await User.findById(req.userId)
        user.avatar_url = avatar_url
        await user.save()

        return res.status(200).json({
            message: 'avatar picture updated'
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}


// exports.updateProfile = async (req, res) => {
//     try {
//         const {first_name, last_name, username, about} = req.body

//         let error = {}

//         const user_username = await User.findOne({username})
//         if (user_username) {
//             error.username = 'Username has been used'
//         }

//         if(Object.keys(error).length){
//             return res.status(422).json({error})
//         }
//         const user = await User.findById(req.userId)
//         user.cover_url = cover_url
//         await user.save()

//         return res.status(200).json({
//             message: 'cover picture updated'
//         })
//     } catch (err){
//         console.log(err)
//         return res.status(500).json({error: 'Something went wrong'})
//     }
// }
