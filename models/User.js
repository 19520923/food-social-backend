const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    first_name: {
        type: String,
        trim: true,
        required: true
    },
    
    last_name: {
        type: String,
        trim: true,
        required: true
    },

    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        lowercase: true,
    },

    username: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
        
    },

    is_current: {
        type: Boolean,
        default: false
    },

    is_active: {
        type: Boolean,
        default: true
    },

    is_verified: {
        type: Boolean,
        default: false
    },

    avatar_url: {
        type: String,
        default :''
    },

    cover_url: {
        type: String,
        default: ''
    },

    about: {
        type: String,
        default: ''
    },

    follower: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    last_login: {
        type: Date,
        default: ''
    },

    socket_id: {
        type:String,
        default: ''
    }

},

    {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}

)

module.exports = mongoose.model('User', UserSchema)