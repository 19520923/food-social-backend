const User = require('../../models/User')
const FilterUserData = require('../../utils/FilterUserData')
const Notification =  require('../../models/Notification')
const FilterNotification = require('../../utils/FilterNotification')

exports. fetchUserById = async (req, res) =>{
    try{
        const user = await User.findById(req.params.user_id).populate('follower').populate('following')
        const userData = FilterUserData(user)

        return res.status(200).json({
            user: userData
        })
    } catch(err){
        console.log(err)
        return res.status(500).json({
            error: 'Something went wrong',
        })
    }
}

exports.searchUsers = async (req, res) => {
    try {
        const users = await User.find({$or: [
            {email: {$regex: req.params.search, $options: 'i'}},
            {username: {$regex: req.params.search, $options: 'i'}},
            {first_name: {$regex: req.params.search, $options: 'i'}},
            {last_name: {$regex: req.params.search, $options: 'i'}},
        ]}).populate('follower')
            .populate('following')

        const usersData = users.map(user => 
            FilterUserData(user)
        )

        return res.status(200).json({
            users: usersData
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

        if(!user) {
            return res.status(404).json({
                error: 'User not found'
            })
        }

        const userData = FilterUserData(user)

        const follower = user.follower.map(f => {
            return {
                id: f.id,
                first_name: f.first_name,
                last_name: f.last_name,
                username: f.username,
                email: f.email,
                is_current: f.is_current,
                avatar_url: f.avatar_url,
                cover_url: f.cover_url,
                about: f.about,
                last_login: f.last_login,
                created_at: f.created_at,
            }
            
        })

        const following = user.following.map(f => {
                return {
                    id: f.id,
                    first_name: f.first_name,
                    last_name: f.last_name,
                    username: f.username,
                    email: f.email,
                    is_current: f.is_current,
                    avatar_url: f.avatar_url,
                    cover_url: f.cover_url,
                    about: f.about,
                    last_login: f.last_login,
                    created_at: f.created_at,
                }
        })

        userData.follower = follower
        userData.following = following

        const notifications = await Notification.find({receiver: req.userId}).sort({create_at: -1})
        let notifData = notifications.map(notif => {
            return {
                ...FilterNotification(notif)
            }
        })

        return res.status(200).json({
            user: userData,
            notifications: notifData
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: 'Something went wrong'
        })
    }
}