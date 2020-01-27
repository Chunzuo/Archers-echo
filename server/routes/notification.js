const express = require("express");
const { notificationController } = require("../controllers");
const router = express.Router();

router.get("/admin", notificationController.getAdminNotifications);
router.get("/getByUserId/:userId", notificationController.getByUserId);

router.post("/addUserNotification", notificationController.addUserNotification);
router.post(
  "/removeMultiNotification",
  notificationController.removeMultiNotification
);

router.delete("/removeByUser/:userId", notificationController.removeByUser);
router.delete("/:id", notificationController.removeNotification);

module.exports = router;
