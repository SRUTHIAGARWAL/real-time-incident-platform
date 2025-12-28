const mongoose = require("mongoose");

const IncidentSchema = new mongoose.Schema({
  type: String,
  description: String,
  location: {
    lat: Number,
    lng: Number
  },
  status: { type: String, default: "reported" },
  upvotes: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Incident", IncidentSchema);
