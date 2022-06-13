const User = require('../../models/User')
const Notification = require('../../models/Notification')

exports.fetchUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id).populate('follower').populate('following')

        return res.status(200).json({
            user: user
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: 'Something went wrong',
        })
    }
}

exports.searchUsers = async (req, res) => {
    try {
        const users = await User.find({
            $or: [
                { email: { $regex: req.params.search, $options: 'i' } },
                { username: { $regex: req.params.search, $options: 'i' } },
                { first_name: { $regex: req.params.search, $options: 'i' } },
                { last_name: { $regex: req.params.search, $options: 'i' } },
            ]
        }).populate('follower')
            .populate('following')

        return res.status(200).json({
            users: users
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: 'Something went wrong'
        })
    }
}

exports.me = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('follower').populate('following')

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            })
        }

        const notifications = await Notification.find({ receiver: req.userId }).sort({ create_at: -1 }).populate('author').populate({path: 'post_data', populate: {path: 'author', path: 'foods'}}).populate({path: 'food_data', populate: {path: 'author'}})

        return res.status(200).json({
            user: user,
            notifications: notifications
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: 'Something went wrong'
        })
    }
}