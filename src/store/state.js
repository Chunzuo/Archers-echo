/*=========================================================================================
  File Name: state.js
  Description: Vuex Store - state
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Version: 1.1
  Author: Pixinvent
  Author URL: hhttp://www.themeforest.net/user/pixinvent
==========================================================================================*/

import userNavbarSearchAndPinList from "@/layouts/components/navbarSearchAndPinList/user.js";
import adminNavbarSearchAndPinList from "@/layouts/components/navbarSearchAndPinList/admin.js";
// import themeConfig from "@/../themeConfig.js";
import colors from "@/../themeConfig.js";

const state = {
  isSidebarActive: true,
  breakpoint: null,
  sidebarWidth: "default",
  reduceButton: "",//themeConfig.sidebarCollapsed,
  bodyOverlay: false,
  sidebarItemsMin: false,
  theme: "", //themeConfig.theme || "light",
  userNavbarSearchAndPinList: userNavbarSearchAndPinList,
  adminNavbarSearchAndPinList: adminNavbarSearchAndPinList,
  AppActiveUser: {
    id: 0,
    name: "John Doe",
    about:
      "Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.",
    img: "avatar-s-11.png",
    status: "online"
  },

  themePrimaryColor: colors.primary,
  socketConnected: false
};

export default state;
