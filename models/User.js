const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    first_name: {
      type: String,
      trim: true,
      required: true,
    },

    last_name: {
      type: String,
      trim: true,
      required: true,
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
      default: false,
    },

    is_active: {
      type: Boolean,
      default: true,
    },

    is_verified: {
      type: Boolean,
      default: true,

      //set false for default
    },

    avatar_url: {
      type: String,
      default:
        "https://i.pinimg.com/564x/f7/c9/21/f7c9219902a7472f5c9bc244548311ce.jpg",
    },

    cover_url: {
      type: String,
      default:
        "https://i.pinimg.com/originals/28/35/be/2835be38b5274a4b20155999a7613542.jpg",
    },

    about: {
      type: String,
      default: "",
    },

    follower: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    last_login: {
      type: Date,
      default: "",
    },

    socket_id: {
      type: String,
      default: "",
    },
  },

  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("User", UserSchema);
