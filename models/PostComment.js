const mongoose = require('mongoose')

const PostCommentSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },

    content: {
        type: String,
        trim: true,
        require: true
    },

    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostComment'
    }
})

PostCommentSchema.virtual('childrent', {
    ref: 'PostComment',
    localField: '_id',
    foreignField: 'parent',
    sort: { createdAt: -1 }
})

module.exports = mongoose.model('PostComment', PostCommentSchema)
