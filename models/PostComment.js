const mongoose = require("mongoose");

const PostCommentSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },

    content: {
      type: String,
      trim: true,
      require: true,
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PostComment",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

PostCommentSchema.virtual("children", {
  ref: "PostComment",
  localField: "_id",
  foreignField: "parent",
  sort: { created_at: 1 },
});

PostCommentSchema.set("toObject", { virtuals: true });
PostCommentSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("PostComment", PostCommentSchema);
