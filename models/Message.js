const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },

    content: {
      type: String,
      require: true,
    },

    type: {
      type: String,
      enum: ["TEXT", "PICTURE"],
      default: "TEXT",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Message", MessageSchema);
