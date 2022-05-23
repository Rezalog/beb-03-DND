const mongoose = require("mongoose");

// Define Schemes
const pairsSchema = new mongoose.Schema(
  {
    pair_address: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
module.exports = mongoose.model("pairs", pairsSchema);
