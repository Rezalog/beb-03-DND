const mongoose = require("mongoose");

// Define Schemes
const pairsSchema = new mongoose.Schema(
  {
    pair_address: { type: String, required: true },
    pair_name: { type: String },
    token_address: { type: String },
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
module.exports = mongoose.model("pairs", pairsSchema);
