const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    foods: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food',
            default: []
        }
    ],

    content: {
        type: String,
        trim: true,
    },

    photos: {
        type: Array,
        default: []
    },

    num_heart: {
        type: Number,
        default: 0
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    location: {
        name: {
            type: String,
            default: ''
        },
        lat: {
            type: String,
            default: '',
        },
        lng: {
            type: String,
            default: '',
        }
    },

    is_public: {
        type: Boolean,
        default: true
    }
},
    {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
)

module.exports = mongoose.model('Post', PostSchema)