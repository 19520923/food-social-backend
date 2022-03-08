const mongoose = require('mongoose')

const NotificationSchema = mongoose.Schema({
    notify_type:{
        type: String,
        default: 'SYSTEM',
        enum: ['SYSTEM', 'FOOD', 'POST', 'FOLLOW']
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    destination: {
        type: String,
        default: ''
    },

    is_seen: {
        type: Boolean,
        default: false
    },

    content: {
        type: String,
        default: ''
    }
},

    {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
 
)

module.exports = mongoose.model('Notification', NotificationSchema)