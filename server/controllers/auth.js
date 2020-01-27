const {
  User,
  Admin,
  SupportTicket,
  TempLogin,
  Notification
} = require("../database/models");
const { timeFromSecond } = require("../utils");

exports.login = async (req, res) => {
  const { email, provider } = req.body;

  User.findOne({ email: email })
    .then(user => {
      if (provider && !user) {
        new User({ email: email })
          .save()
          .then(user => {
            User.updateOne(
              { email: email },
              { $set: { loginAttempt: 0, lastLoginTime: new Date() } }
            );
            res.json(user);
          })
          .catch(error => {
            res.status(500).json(error);
          });
      } else {
        User.updateOne(
          { email: email },
          { $set: { loginAttempt: 0, lastLoginTime: new Date() } }
        )
          .then(() => {})
          .catch(error => {
            console.log(error);
          });
        res.json(user);
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.signUp = (req, res) => {
  new User(req.body)
    .save()
    .then(user => {
      const notificationMsg = `${
        req.body.email
      } has registered in archersecho.`;
      new Notification({
        category: 0,
        message: notificationMsg,
        type: true
      }).save();
      res.json(user);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.adminLogin = (req, res) => {
  Admin.find({ userId: req.body.userId, password: req.body.password })
    .then(admin => {
      if (admin.length > 0) {
        res.status(200).json(admin[0]);
      } else {
        res.status(500).json({ err: "No User" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.temporaryLogin = (req, res) => {
  SupportTicket.find({
    userName: req.body.userId,
    password: req.body.password,
    isActive: true
  })
    .then(ticket => {
      if (ticket.length > 0) {
        SupportTicket.update(
          { _id: ticket[0]._id },
          { $set: { isLogin: true } }
        )
          .then(() => {
            res.status(200).json(ticket[0]);
          })
          .catch(err => {
            res.status(500).json(err);
          });
      } else {
        res.status(500).json({ msg: "No user found" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.getLoginAttemptInfo = (req, res) => {
  const ip = (
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  ).split(",")[0];

  TempLogin.findOne({ ipAddress: ip })
    .then(tempLoginInfo => {
      res.json(tempLoginInfo);
    })
    .catch(err => {
      res.json(err).status(500);
    });
};

exports.getPaneltyRemainTime = (req, res) => {
  const ip = (
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  ).split(",")[0];

  TempLogin.findOne({ ipAddress: ip }).then(tempLoginInfo => {
    const now = new Date();
    const passTime = now.getTime() - tempLoginInfo.paneltyTime.getTime();
    if (passTime < 1000 * 60 * 15) {
      const remainTime = Math.floor((1000 * 60 * 15 - passTime) / 1000);
      res.json({ noPanelty: false, time: timeFromSecond(remainTime) });
    } else {
      TempLogin.update(
        { ipAddress: ip },
        {
          $set: {
            isPanelty: false,
            paneltyTime: null
          }
        }
      ).then(() => {
        res.json({ noPanelty: true, time: 0 });
      });
    }
  });
};

exports.tempLoginOut = (req, res) => {
  const ip = (
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  ).split(",")[0];

  TempLogin.update(
    { ipAddress: ip },
    { $set: { isLogin: false, attemptCount: -1 } }
  )
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.updateLoginAttempt = (req, res) => {
  const { email } = req.body;
  User.findOne({ email: email }).then(user => {
    if (user.status === 2) return;

    let updateQuery = { $inc: { loginAttempt: 1 } };
    if (user.loginAttempt == 9) {
      updateQuery = { $set: { status: 2 } };
    }

    User.updateOne({ email: email }, updateQuery)
      .then(result => {
        res.json(result);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
};
