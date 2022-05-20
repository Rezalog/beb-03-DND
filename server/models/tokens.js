const mongoose = require("mongoose");

// Define Schemes
const tokensSchema = new mongoose.Schema(
  {
    token_address: { type: String, required: true },
    token_name: { type: String },
    token_symbol: { type: String },
  },
  {
    timestamps: true,
  }
);

// Create Model & Export
module.exports = mongoose.model("tokens", tokensSchema);
