//import the User constant explicitly
const { User, Device, Archer } = require("../database/models");
const trunks = require("trunks-log");
const log = new trunks("USERS");
// const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const admin = require("firebase-admin");
const adminAccount = require("../config/archersecho-firebase-admin.json");
admin.initializeApp({
  credential: admin.credential.cert(adminAccount),
  databaseURL: "https://archersecho.firebaseio.com"
});

const firebase = require("firebase");
const serviceAccount = require("../config/archersecho-firebase.json");
firebase.initializeApp(serviceAccount);

// const bcrypt = require('bcrypt-nodejs')

//show all users
exports.index = async (req, res) => {
  //query the DB of all users
  await User.find()
    .exec()
    .then(users => {
      log.success("Retrieved all {} users", users.length);
      res.json({ users: users });
    })
    .catch(err => {
      log.error(err, "Could not retrieve users: {}", err.message);
      res.json({ error: err, message: "Could not retrieve users" }).status(500);
    });
};

//Store a new user
exports.store = async (req, res) => {
  // Generate hash password
  let userInfo = req.body;
  userInfo["password"] = bcrypt.hashSync(userInfo["password"], 10);

  let user = new User(userInfo);

  await user
    .save()
    .then(user => {
      log.success("Created User: {}", user.email);
      //send a 201 and the new resource
      res.status(201).json({ data: user });
    })
    .catch(err => {
      log.error(err, "Error creating user: {}", user.email);
      let errStatus = err.name === "ValidationError" ? 400 : 500;
      res.status(errStatus).json({ err: err });
    });
};

//this function is for looking at one user by their mongo id
exports.show = async (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      res.json(user);
    })
    .catch(error => {
      res.status(500).json(error);
    });
  //find this sneaky boye
  // const user = await User.findById(req.params.id);

  // const archers = await Archer.find({
  //   userId: mongoose.Types.ObjectId(user._id)
  // });
  // let archerIds = [];
  // let instanceCount = 0;
  // for (const archer of archers) {
  //   instanceCount += archer.instances.length;
  //   archerIds.push(archer._id);
  // }

  // const deviceCount = await Device.find({
  //   archerId: { $in: archerIds }
  // }).count();

  // user["archerCount"] = archers.length;
  // user["instanceCount"] = instanceCount;
  // user["deviceCount"] = deviceCount;

  // res.json({
  //   profileUrl: user.profileUrl,
  //   userId: user.userId,
  //   companyName: user.companyName,
  //   archerCount: archers.length,
  //   instanceCount: instanceCount,
  //   deviceCount: deviceCount,
  //   id: user._id,
  //   name: user.name
  // });
};

//ever wanted to make the users disappear
exports.delete = async (req, res) => {
  const { id, email } = req.body;
  // Get Archers info.
  const archers = await Archer.find({ userId: id });
  let archerIds = [];
  for (const archer of archers) {
    archerIds.push(archer._id);
  }
  // Remove Devices info
  await Device.remove({ archerId: { $in: archerIds } });
  // Remove Archers info
  await Archer.remove({ userId: id });
  // Remove user info

  admin
    .auth()
    .getUserByEmail(email)
    .then(userInfo => {
      admin
        .auth()
        .deleteUser(userInfo.uid)
        .then(() => {
          User.findByIdAndRemove(id)
            .exec()
            .then(() => {
              log.success("Deleted User: {}", req.params.id);
              //let em know there aint no content no mo
              res.status(204).json();
            })
            .catch(err => {
              log.error(err, "Error finding user: {}", req.params.id);
              res.status(500).json({ err: err });
            });
        })
        .catch(error => {
          res.status(500).json(error);
        });
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

//edit a user based on ID
exports.update = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .exec()
    .then(user => {
      log.success("Updated user: {}", req.params.id);
      res.status(200).json({ user: user });
    })
    .catch(err => {
      log.error(err, "Could not update user: {}", req.params.id);
      res.status(500).json({ err: err });
    });
};

exports.list = async (req, res) => {
  User.find({ role: 0 })
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.getOthers = (req, res) => {
  const { myId } = req.params;
  User.find({ _id: { $ne: myId } })
    .then(others => {
      let result = [];
      for (const other of others) {
        result.push(other.userId);
      }
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.updateStatus = async (req, res) => {
  const { id, status } = req.body;
  User.updateOne({ _id: id }, { $set: { status: status } })
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(500).json(error);
    });
  // const user = await User.findById(id);
  // let query = {
  //   isActive: status
  // };
  // if (!user.activatedAt) {
  //   query = {
  //     activatedAt: new Date(),
  //     isActive: status
  //   };
  // }
  // User.update({ _id: id }, { $set: query })
  //   .then(result => {
  //     res.status(200).json(result);
  //   })
  //   .catch(err => {
  //     res.status(500).json(err);
  //   });
};

exports.updatePassword = async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;

  const user = await User.findById(id);
  if (!bcrypt.compareSync(oldPassword, user.password)) {
    return res.status(500).json({ message: "Old password is incorrect" });
  }
  User.update(
    { _id: id },
    {
      $set: {
        password: bcrypt.hashSync(newPassword, 10),
        passwordUpdatedAt: new Date()
      }
    }
  )
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.json(err).status(500);
    });
};

exports.insertSocketId = (userId, socketId, ipAddress) => {
  User.update(
    { _id: userId },
    { $set: { socketId: socketId, ipAddress: ipAddress } }
  )
    .then(() => {
      console.log("success in insert socketId");
    })
    .catch(err => {
      console.log("failed in insert socketId");
      console.log(err);
    });
};

exports.updateSocketIdByIpAddress = (socketId, ipAddress, cb) => {
  User.update({ ipAddress: ipAddress }, { $set: { socketId: socketId } }, cb);
};

exports.removeSocketId = (socketId, cb) => {
  User.update({ socketId: socketId }, { $set: { socketId: null } }, cb);
};

exports.getSocketIdById = (userId, cb) => {
  User.findById(userId)
    .then(user => {
      cb(null, user);
    })
    .catch(err => {
      cb(err, null);
    });
};

exports.updateSocketIdByUserId = (req, res) => {
  const { userId, socketId } = req.body;
  User.update({ _id: userId }, { $set: { socketId: socketId } })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.addUser = (req, res) => {
  const { email, password, userName, companyName } = req.body;

  admin
    .auth()
    .createUser({
      email: email,
      password: password,
      displayName: userName
    })
    .then(response => {
      console.log(response);
      new User({
        email: email,
        userName: userName,
        companyName: companyName,
        uid: response.uid
      })
        .save()
        .then(result => {
          res.json(result);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.passwordReset = (req, res) => {
  const { email } = req.body;
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(response => {
      res.json(response);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.updateProfile = (req, res) => {
  const { email, password, userName, companyName, uid, _id } = req.body;
  let updateObj = {};
  if (password) {
    updateObj = {
      email: email,
      password: password,
      displayName: userName
    };
  } else {
    updateObj = {
      email: email,
      displayName: userName
    };
  }
  admin
    .auth()
    .updateUser(uid, updateObj)
    .then(() => {
      User.updateOne(
        { _id: _id },
        {
          email: email,
          userName: userName,
          companyName: companyName
        }
      )
        .then(result => {
          res.json(result);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    })
    .catch(error => {
      res.status(500).json(error);
    });
};
