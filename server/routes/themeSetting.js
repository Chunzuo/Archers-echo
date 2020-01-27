const express = require("express")

const { themeSettingsController } = require("../controllers")

const router = express.Router()

router.get("/", themeSettingsController.info)
router.post("/", themeSettingsController.update)

module.exports = router