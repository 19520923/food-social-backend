const Notification =  require('../models/Notification')

module.exports = async ({receiver, content, destination = '', type = 'SYSTEM', author}) => {
    const notification = new Notification({
        author: author._id,
        receiver: receiver._id,
        notify_type: type,
        destination: destination,
        content: content
    })

    const savedNotif = await notification.save()

    const notifData = savedNotif.populate('author').execPopulate()

    return notifData
}