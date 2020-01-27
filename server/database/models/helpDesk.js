const mongoose = require("mongoose");

const definition = {
  name: { type: String, default: "" },
  description: { type: String, default: "" },
  openedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  closedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  openDate: { type: Date, default: null },
  closeDate: { type: Date, default: null },
  status: { type: Number, default: 0 }, //0: open, 1: in progress, 2: Stop, 3: Done, 4: Trash, 5: Remove
  note: { type: String, default: "" },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  archer: { type: mongoose.Schema.Types.ObjectId, ref: "Archer" },
  messages: [
    {
      content: { type: String, default: "" },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      time: { type: Date, default: null },
      readStatus: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          status: { type: Boolean, default: false }
        }
      ]
    }
  ]
};

const options = {
  timestamps: true
};

const helpDeskSchema = new mongoose.Schema(definition, options);

module.exports = mongoose.model("HelpDesk", helpDeskSchema);
