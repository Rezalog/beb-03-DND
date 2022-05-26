const mongoose = require("mongoose");

// Define Schemes
const v2pairsSchema = new mongoose.Schema(
  {
    v2pair_address: { type: String, required: true },
    v2pair_name: { type: String },
    v2tokenA_address: { type: String },
    v2tokenB_address: { type: String },
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
module.exports = mongoose.model("v2pairs", v2pairsSchema);
