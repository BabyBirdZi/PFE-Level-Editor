const mongoose = require("mongoose");

const CellSchema = new mongoose.Schema(
  {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    object: {
      type: {
        type: String,
        required: true,
      },
      variant: {
        type: String,
        default: "",
      },
    },
  },
  { _id: false }
);

const LevelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "Untitled Level",
    },
    gridSize: {
      type: Number,
      default: 20,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cells: {
      type: [CellSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Level", LevelSchema);