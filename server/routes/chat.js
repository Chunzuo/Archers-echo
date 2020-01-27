const express = require("express");
const { chatController } = require("../controllers");
const router = express.Router();

router.get("/getChannelLogs/:channelId", chatController.getChannelMessageLog);
router.get("/getContacts/:userId", chatController.getContacts);

router.post("/getChannels", chatController.getChannels);
router.post(
  "/readUnreadChannelMessage",
  chatController.readUnreadChannelMessage
);
router.post("/readUnreadDirectMessage", chatController.readUnreadDirectMessage);

module.exports = router;
