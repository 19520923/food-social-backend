const User = require('../models/User')
const FilterUserData = require('./FilterUserData')

module.exports = (notif) => {

    return {
        id: notif.id,
        author: notif.author,
        notify_type: notif.notify_type,
        destination: notif.destination,
        content: notif.content,
        reated_at: notif.created_at,
        is_seen: notif.is_seen
    }
}