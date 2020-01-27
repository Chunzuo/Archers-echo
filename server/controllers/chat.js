const { HelpDesk, Notification, Chat, User } = require("../database/models");
const Promise = require("bluebird");

exports.getChannels = (req, res) => {
  const { id } = req.body;
  HelpDesk.find(
    {
      $or: [{ openedBy: id }, { assignedTo: id }]
    },
    { name: 1, messages: 1, description: 1 }
  )
    .populate("openedBy", "email socketId")
    .populate("assignedTo", "email socketId")
    .populate("messages.sender")
    .then(helpDesks => {
      let result = [];
      for (const helpDesk of helpDesks) {
        let unreadMsgCnt = 0;
        for (const msg of helpDesk.messages) {
          for (const data of msg.readStatus) {
            if (!data.user) continue;
            if (data.user.toString() === id && !data.status) {
              unreadMsgCnt += 1;
            }
          }
        }

        let members = [];
        if (helpDesk.openedBy._id.toString() !== id) {
          members.push({
            email: helpDesk.openedBy.email,
            status: helpDesk.openedBy.socketId ? 1 : 2 //1: online, 2: offline
          });
        }
        for (const member of helpDesk.assignedTo) {
          if (member._id.toString() !== id) {
            members.push({
              email: member.email,
              status: member.socketId ? 1 : 2
            });
          }
        }

        result.push({
          name: helpDesk.name,
          members: members,
          id: helpDesk._id,
          unreadMsgCnt: unreadMsgCnt,
          messages: helpDesk.messages,
          description: helpDesk.description
        });
      }
      res.json(result);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.getChannelMessageLog = (req, res) => {
  const { channelId } = req.params;
  console.log(channelId);
  HelpDesk.findOne({ _id: channelId }, { messages: 1 })
    .populate("messages.sender")
    .then(result => {
      console.log("Result");
      res.json(result.messages);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.insertChannelMessage = (data, io) => {
  const { content, sender, time, channelId } = data;

  HelpDesk.findOne({ _id: channelId }, { _id: 1, name: 1 })
    .populate("openedBy", "socketId email")
    .populate("assignedTo", "socketId email")
    .then(result => {
      let members = [],
        notifications = [],
        otherMembers = [],
        senderEmail = "";

      if (sender !== result.openedBy._id.toString()) {
        otherMembers.push({
          user: result.openedBy._id,
          status: false
        });
        result.openedBy.socketId
          ? members.push(result.openedBy.socketId)
          : notifications.push(result.openedBy.id);
      } else {
        senderEmail = result.openedBy.email;
      }
      result.assignedTo.forEach(member => {
        if (member._id.toString() !== sender) {
          otherMembers.push({ user: member._id, status: false });
          member.socketId
            ? members.push(member.socketId)
            : notifications.push(member.id);
        } else {
          senderEmail = member.email;
        }
      });

      // Send MessageArrive Notification to online users
      data["channelName"] = result.name;
      data["sender"] = {
        _id: sender,
        email: senderEmail
      };

      members.forEach(member => {
        io.to(member).emit("NTF_ARRIVE_CHANNEL_MESSAGE", data);
      });

      // send Notifications to offline users
      notifications.forEach(member => {
        new Notification({
          category: 2,
          message: `${result.name}`,
          type: false,
          // link: "http://localhost:8080/user/chat",
          link: "http://archersecho.com/user/chat",
          userId: member,
          identify: channelId
        })
          .save()
          .then(() => {});
      });

      // Save notification
      HelpDesk.update(
        { _id: channelId },
        {
          $push: {
            messages: {
              content: content,
              sender: sender,
              time: time,
              readStatus: otherMembers
            }
          }
        }
      ).then(() => {});
    });
};

exports.readUnreadChannelMessage = (req, res) => {
  const { channelId, userId } = req.body;
  HelpDesk.updateOne(
    { _id: channelId },
    {
      // $set: { "messages.$[].readStatus.$[].status": true }
      $set: { "messages.$[].readStatus.$[identifier].status": true }
    },
    {
      arrayFilters: [{ "identifier.user": userId }]
    }
  )
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.getContacts = (req, res) => {
  const { userId } = req.params;
  HelpDesk.find({ $or: [{ openedBy: userId }, { assignedTo: userId }] })
    .populate("openedBy", "email")
    .populate("assignedTo", "email")
    .then(helpDesks => {
      let members = [];
      for (const helpDesk of helpDesks) {
        if (helpDesk.openedBy._id.toString() !== userId) {
          members.push({
            email: helpDesk.openedBy.email,
            id: helpDesk.openedBy._id
          });
        }
        for (const member of helpDesk.assignedTo) {
          if (member._id.toString() !== userId) {
            members.push({ email: member.email, id: member._id });
          }
        }
      }
      const uniqueMembers = members.filter((member, index) => {
        return (
          index ===
          members.findIndex(obj => {
            return member.email === obj.email;
          })
        );
      });
      return Promise.map(uniqueMembers, member => {
        return Chat.find({
          $or: [
            { sender: userId, "receiver.id": member.id },
            { sender: member.id, "receiver.id": userId }
          ]
        }).then(chats => {
          let unreadMsgCnt = 0;
          for (const chat of chats) {
            if (
              chat.receiver.id.toString() === member.id.toString() &&
              chat.sender.toString() === member.id.toString() &&
              !chat.receiver.readStatus
            ) {
              unreadMsgCnt += 1;
            }
          }
          return {
            id: member.id,
            email: member.email,
            msg: chats,
            unreadMsgCnt: unreadMsgCnt
          };
        });
      }).then(result => {
        res.json(result);
      });
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.addDirectMessage = (data, io) => {
  new Chat(data).save().then(() => {
    User.findOne({ _id: data.receiver.id }).then(user => {
      if (user.socketId) {
        io.to(user.socketId).emit("NTF_DIRECT_MESSAGE", data);
      } else {
        new Notification({
          category: 2,
          message: data.senderEmail,
          type: false,
          link: "http://archersecho.com/user/chat",
          userId: user.id,
          identify: data.sender
        })
          .save()
          .then(() => {})
          .catch(error => {
            console.log(error);
          });
      }
    });
  });
};

exports.readUnreadDirectMessage = (req, res) => {
  const { sender, receiver } = req.body;
  Chat.updateMany(
    { sender: sender, "receiver.id": receiver },
    {
      $set: {
        "receiver.readStatus": true
      }
    }
  )
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};
