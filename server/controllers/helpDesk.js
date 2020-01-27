const { HelpDesk, Archer, User, Notification } = require("../database/models");

const mongoose = require("mongoose");
const Promise = require("bluebird");

exports.addTicket = (data, cb) => {
  const { assignTo, description, name, creator, archer } = data;
  new HelpDesk({
    name: name,
    description: description,
    openedBy: creator,
    openDate: new Date(),
    assignedTo: assignTo,
    archer: archer
  })
    .save()
    .then(result => {
      cb(null, result);
    })
    .catch(err => {
      cb(err);
    });
};

exports.getAllList = (req, res) => {
  HelpDesk.find({})
    .populate("openedBy", "userId")
    .populate("closedBy", "userId")
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.deleteTicket = (req, res) => {
  const { id } = req.params;
  HelpDesk.remove({ _id: id })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.getInfo = (req, res) => {
  const { id } = req.params;
  HelpDesk.findById(id)
    .populate("openedBy", "email")
    .populate("closedBy", "email")
    .populate("assignedTo", "email")
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.updateStatus = (req, res) => {
  const { status, id } = req.body;
  HelpDesk.updateOne({ _id: id }, { $set: { status: status } })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.saveNote = (req, res) => {
  const { id, note } = req.body;
  HelpDesk.updateOne({ _id: id }, { $set: { note: note } })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.close = (req, res) => {
  const { id, closedBy } = req.body;
  HelpDesk.updateOne(
    { _id: id },
    { $set: { status: 3, closedBy: closedBy, closeDate: new Date() } }
  )
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.validateUser = (req, res) => {
  const { userId } = req.params;
  Archer.find({ userId: userId, helpDeskTicket: true })
    .count()
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.getMyTickets = (req, res) => {
  const { userId } = req.params;
  HelpDesk.find({
    $or: [{ openedBy: userId }, { assignedTo: mongoose.Types.ObjectId(userId) }]
  })
    .populate("closedBy", "email")
    .populate("assignedTo", "email")
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.update = (req, res) => {
  HelpDesk.updateOne({ _id: req.params.id }, { $set: req.body })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.getRequestTickets = (req, res) => {
  const { userId } = req.params;
  HelpDesk.find({ assignedTo: mongoose.Types.ObjectId(userId) })
    .populate("openedBy", "userId")
    .populate("closedBy", "userId")
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.getMemerbsSocketInfo = (memberIds, message, ticketId, cb) => {
  Promise.map(memberIds, memberId => {
    // save notification data
    new Notification({
      category: 1,
      message: message,
      type: false,
      // link: `http://localhost:8080/user/helpdesk-ticket/detail/${ticketId}`,
      link: `http://archersecho.com/user/helpdesk-ticket/detail/${ticketId}`,
      userId: memberId
    })
      .save()
      .then(() => {
        console.log("Success in save HelpDeskTicket notification");
      })
      .catch(error => {
        console.log("Failed in save HelpDeskTicket notification");
        console.log(error);
      });

    return User.findById(memberId)
      .then(member => {
        return member.socketId;
      })
      .catch(error => {
        console.log(error);
        return null;
      });
  }).then(result => {
    const socketIds = result.filter(i => {
      return i !== null;
    });
    cb(socketIds);
  });
};
