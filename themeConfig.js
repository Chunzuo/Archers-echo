/*=========================================================================================
  File Name: themeConfig.js
  Description: Theme configuration
  ----------------------------------------------------------------------------------------
  Item Name: Modern Admin - Clean Bootstrap 4 Dashboard HTML Template
  Version: 1.1
  Author: Pixinvent
  Author URL: hhttp://www.themeforest.net/user/pixinvent
==========================================================================================*/

// MAIN COLORS - VUESAX THEME COLORS
let colors = {
  primary: "#7367F0",
  success: "#28C76F",
  danger: "#EA5455",
  warning: "#FF9F43",
  dark: "#1E1E1E"
};

import Vue from "vue";
import Vuesax from "vuesax";
Vue.use(Vuesax, { theme: { colors } });


// CONFIGS
let themeConfig = {
  theme: "light", // options[String]: 'light'(default), 'dark', 'semi-dark'
  sidebarCollapsed: false, // options[Boolean]: true, false(default)
  navbarColor: "#fff", // options[String]: HEX color / rgb / rgba / Valid HTML Color name - (default: #fff)
  navbarType: "floating", // options[String]: floating(default) / static / sticky / hidden
  footerType: "static", // options[String]: static(default) / sticky / hidden
  routerTransition: "zoom-fade", // options[String]: zoom-fade / slide-fade / fade-bottom / fade / zoom-out / none(default)
  hideScrollToTop: false,				// options[Boolean]: true, false(default)
  disableCustomizer: true // options[Boolean]: true, false(default)
};

export default themeConfig;