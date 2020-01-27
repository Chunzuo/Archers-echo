//bring in the seperate models
const User = require("./user");
const Device = require("./device");
const Admin = require("./admin");
const PortentialSupport = require("./portentialSupport");
const UploadFile = require("./upload");
const TempUser = require("./tempUser");
const SupportTicket = require("./supportTicket");
const CpuMemoryUtilization = require("./cpu_memory_utilization");
const Archer = require("./archer");
const Rule = require("./rule");
const Uptime = require("./uptime");
const Team = require("./team");
const WindowsEventLog = require("./windowsEventLog");
const IisLog = require("./iisLog");
const TempLogin = require("./tempLogin");
const HelpDesk = require("./helpDesk");
const Notification = require("./notification");
const Chat = require("./chat");
const ThemeSetting = require("./theme_settings")

//export em in a good ol' bundle
module.exports = {
  User,
  Device,
  Admin,
  PortentialSupport,
  UploadFile,
  TempUser,
  SupportTicket,
  CpuMemoryUtilization,
  Archer,
  Rule,
  Uptime,
  Team,
  WindowsEventLog,
  IisLog,
  TempLogin,
  HelpDesk,
  Notification,
  Chat,
  ThemeSetting
};
