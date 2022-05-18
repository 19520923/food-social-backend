const mongoose = require('mongoose')

const PostReactionSchema = mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

},

    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)


module.exports = mongoose.model('PostReaction', PostReactionSchema)