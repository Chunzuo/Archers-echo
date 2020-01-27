import Vue from "vue";
import { AclInstaller, AclCreate, AclRule } from "vue-acl";
import router from "@/router";

Vue.use(AclInstaller);

let initialRole = "user";

if (localStorage.getItem("userRole"))
  initialRole =
    parseInt(localStorage.getItem("userRole")) === 1 ? "admin" : "user";

export default new AclCreate({
  initial: initialRole,
  notfound: "/pages/not-authorized",
  router,
  acceptLocalRules: true,
  globalRules: {
    isAdmin: new AclRule("admin"),
    isUser: new AclRule("user"),
    common: new AclRule("admin").or("user").generate()
  },
  middleware: async acl => {
    console.log(acl);
  }
});
