const mongoose = require("mongoose");

const definition = {
  content: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiver: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    readStatus: { type: Boolean, default: false }
  },
  time: { type: Date, default: Date.now }
};

const options = {
  timestamps: true
};

const chatSchema = new mongoose.Schema(definition, options);

module.exports = mongoose.model("Chat", chatSchema);
