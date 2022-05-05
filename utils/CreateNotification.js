const Notification =  require('../models/Notification')

module.exports = async ({receiver, content, destination = '', type = 'SYSTEM', author}) => {
    const notification = new Notification({
        author: author,
        receiver: receiver,
        notify_type: type,
        destination: destination,
        content: content
    })

    const savedNotif = await notification.save()

    const notifData = await Notification.findById(savedNotif.id).populate('author')

    return notifData
}