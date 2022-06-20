const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema(
  {
    user_1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    user_2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    is_user_1_seen: {
      type: Boolean,
      default: false,
    },

    is_user_2_seen: {
      type: Boolean,
      default: false,
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Chat", ChatSchema);
