const mongoose = require("mongoose");

const FoodSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: true,
    },

    ingredients: {
      type: Array,
      default: [],
    },

    recipe: {
      type: Array,
      default: [],
    },

    avg_score: {
      type: Number,
      default: 0,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    photo: {
      type: String,
      default: "",
    },

    num_rate: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

FoodSchema.index({ name: "text" });

module.exports = mongoose.model("Food", FoodSchema);
