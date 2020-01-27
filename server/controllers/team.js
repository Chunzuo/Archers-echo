const { Team, User } = require("../database/models");
const Promise = require("bluebird");
const mongoose = require("mongoose");

exports.add = async (req, res) => {
  const { name, userId, members } = req.body;

  Promise.map(members, member => {
    return User.findOne({ email: member }).then(user => {
      return user ? { id: user._id } : null;
    });
  }).then(findResult => {
    const userIds = findResult.filter(result => {
      return result !== null;
    });
    // console.log('Finded userIds')
    // console.log(userIds)
    new Team({
      name: name,
      members: userIds,
      owner: userId
    })
      .save()
      .then(team => {
        res.status(200).json(team);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });
};

exports.addMember = async (req, res) => {
  const { id, newMemberEmail } = req.body;
  User.findOne({ email: newMemberEmail }).then(user => {
    Team.update({ _id: id }, { $push: { members: { id: user._id } } })
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });
};

exports.getMyTeam = async (req, res) => {
  const { userId } = req.params;
  Team.find({ owner: userId })
    .populate("members.id", "email")
    .then(teams => {
      res.status(200).json(teams);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.getTeamInfo = async (req, res) => {
  const { teamId } = req.params;
  Team.findById(teamId)
    .populate("members.id", "email userName")
    .populate("owner", "userName")
    .then(team => {
      res.status(200).json(team);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.update = async (req, res) => {
  const { id, name } = req.body;
  const updateObj = { name: name };
  Team.update({ _id: id }, { $set: updateObj })
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.remove = (req, res) => {
  const { teamId } = req.params;
  Team.remove({ _id: teamId })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.getJoinTeam = (req, res) => {
  const { userId } = req.params;
  Team.find({ "members.id": mongoose.Types.ObjectId(userId) })
    .populate("owner", "email")
    .then(teams => {
      let result = [];
      teams.map(team => {
        team.members.forEach(member => {
          if (member.id.toString() === userId) {
            // team['status'] = member.status
            result.push({
              name: team.name,
              owner: team.owner,
              status: member.status,
              id: team._id,
              myId: userId
            });
          }
        });
      });
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.updateMemberStatus = (req, res) => {
  const { status, memberId, teamId } = req.body;
  Team.update(
    { _id: teamId, "members.id": memberId },
    { $set: { "members.$.status": status } }
  )
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.removeMember = (req, res) => {
  const { teamId, memberId } = req.body;
  Team.update({ _id: teamId }, { $pull: { members: { _id: memberId } } })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.getMemberList = (req, res) => {
  const { userId } = req.params;

  Team.find({ owner: mongoose.Types.ObjectId(userId) })
    .populate("members.id", "email")
    .then(teams => {
      let members = [];
      for (const team of teams) {
        for (const member of team.members) {
          if (member.status === 1) {
            members.push(member);
          }
        }
      }
      const uniqueArray = members.filter((member, index) => {
        return (
          index ===
          members.findIndex(obj => {
            return member.id && obj.id.email === member.id.email;
          })
        );
      });

      res.json(uniqueArray);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.updateAllow = async (req, res) => {
  const { memberId, allow } = req.body;
  console.log(`memberId: ${memberId}`);
  console.log(`allow: ${allow}`);
  Team.updateMany(
    { "members.id": memberId },
    { $set: { "members.$.allowHelpDesk": allow } }
  )
    .then(result => {
      console.log("success in updateAllow");
      console.log(result);
      res.json(result);
    })
    .catch(err => {
      console.log(err.stack);
      res.status(500).json(err);
    });
};

exports.getHelpDeskMembers = async (req, res) => {
  const { userId } = req.params;
  console.log(`userId: ${userId}`);
  const teams = await Team.find({
    owner: mongoose.Types.ObjectId(userId)
  }).populate("members.id", "userId");

  let members = [];
  for (const team of teams) {
    for (const member of team.members) {
      if (member.allowHelpDesk) {
        members.push(member.id.userId);
      }
    }
  }

  const uniqueArray = members.filter((member, index) => {
    return (
      index ===
      members.findIndex(obj => {
        return obj === member;
      })
    );
  });

  console.log("__uniqueArray__");
  console.log(uniqueArray);
  res.json(uniqueArray);
};

exports.searchMember = async (req, res) => {
  const { keyword, myId } = req.body;
  User.find({
    $and: [
      { email: { $regex: keyword } },
      { _id: { $ne: mongoose.Types.ObjectId(myId) } }
    ]
  })
    .then(users => {
      let result = [];
      for (const user of users) {
        result.push({ name: user.email });
      }
      res.json(result);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};
