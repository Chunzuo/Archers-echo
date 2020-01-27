const express = require("express");

const { catchErrors } = require("../middleware/error-handler");
const { authController } = require("../controllers");

const router = express.Router();

router.post("/login", catchErrors(authController.login));
router.post("/signup", authController.signUp);
router.post("/adminLogin", authController.adminLogin);
router.post("/tmpLogin", authController.temporaryLogin);
router.post("/updateLoginAttempt", authController.updateLoginAttempt);

router.get("/loginAttemptInfo", authController.getLoginAttemptInfo);
router.get("/paneltyRemainTime", authController.getPaneltyRemainTime);
router.get("/tempLoginOut", authController.tempLoginOut);

module.exports = router;
