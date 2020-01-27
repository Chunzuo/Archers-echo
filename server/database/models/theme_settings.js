const mongoose = require("mongoose")

const definition = {
  primaryColor: { type: String, default: "" },
  theme: { type: String, default: "light" },
  sidebarCollapsed: { type: Boolean, default: false },
  navbarColor: { type: String, default: "#fff" },
  footerType: { type: String, default: "static" },
  routerTransition: { type: String, default: "zoom-fade" },
  hideScrollToTop: { type: Boolean, default: false },
  navbarType: { type: String, default: "floating" }
}

const options = {
  timestamps: true
}

const themeSettingsSchema = new mongoose.Schema(definition, options)

module.exports = mongoose.model("ThemeSetting", themeSettingsSchema)