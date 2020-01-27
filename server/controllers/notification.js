const { Notification } = require("../database/models");

exports.getAdminNotifications = (req, res) => {
  // Check if there is a
  Notification.find({ type: true })
    .then(notifications => {
      res.json(notifications);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.removeNotification = (req, res) => {
  Notification.remove({ _id: req.params.id })
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.getByUserId = (req, res) => {
  const { userId } = req.params;
  Notification.find({ userId: userId })
    .then(notifications => {
      res.json(notifications);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.addUserNotification = (req, res) => {
  new Notification(req.body)
    .save()
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.removeMultiNotification = (req, res) => {
  Notification.remove({ _id: { $in: req.body } })
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.removeByUser = (req, res) => {
  const { userId } = req.params;
  Notification.remove({ userId: userId })
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};
