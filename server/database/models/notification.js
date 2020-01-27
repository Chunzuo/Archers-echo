const mongoose = require("mongoose");

const definition = {
  category: { type: Number, require: true }, // 0: New user, 1: New HelpDesk Ticket, 2: New Message
  message: { type: String, require: true },
  type: { type: Boolean, default: false }, // true: Admin notification, false: User notification
  link: { type: String, default: "" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  identify: { type: String, default: "" }
};

const options = { timestamps: true };

const notificationSchema = new mongoose.Schema(definition, options);

module.exports = mongoose.model("Notification", notificationSchema);
