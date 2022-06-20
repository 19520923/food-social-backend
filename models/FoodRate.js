const mongoose = require("mongoose");

const FoodRateSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
    },

    content: {
      type: String,
      require: true,
      trim: true,
    },

    score: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("FoodRate", FoodRateSchema);
