const Notification =  require('../models/Notification')
const FilterUserData = require('./FilterUserData')
const FilterNotification = require('./FilterNotification')
const User = require('../models/User')

module.exports = async ({receiver, content, destination = '', type = 'SYSTEM', author}) => {
    const notification = new Notification({
        author: author.id,
        receiver: receiver.id,
        notify_type: type,
        destination: destination,
        content: content
    })

    const savedNotif = await notification.save()

    return FilterNotification(savedNotif)
}