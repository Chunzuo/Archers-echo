/*=========================================================================================
  File Name: main.js
  Description: main vue(js) file
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Version: 1.1
  Author: Pixinvent
  Author URL: hhttp://www.themeforest.net/user/pixinvent
==========================================================================================*/

import Vue from "vue";
import App from "./App.vue";

// Vuesax Component Framework
import Vuesax from "vuesax";
import "material-icons/iconfont/material-icons.css"; //Material Icons
import "vuesax/dist/vuesax.css"; // Vuesax
Vue.use(Vuesax);

// Theme Configurations
import "../themeConfig.js";

// Globally Registered Components
import "./globalComponents.js";

// Styles: SCSS
import "./assets/scss/main.scss";

// Tailwind
import "@/assets/css/main.css";

// Vue Router
import router from "./router/index";

// Vuex Store
import store from "./store/store";

// PrismJS
import "prismjs";
import "prismjs/themes/prism.css";

// Feather font icon
require("./assets/css/iconfont.css");

// Fontawesome Icons
require("./assets/fontawesome-icons");

// Token Authentication from localstorage
import { getFromStorage } from "./utils";
const user = getFromStorage("user");
if (user) {
  store.commit("auth/SET_AUTH_STATE", true);
}

// VeeValidate
import VeeValidate from "vee-validate";
Vue.use(VeeValidate);

// jQuery
import "expose-loader?$!expose-loader?jQuery!jquery";
import "./lib/VuelyScript";

// Auth0
import AuthPlugin from "./plugins/auth";
Vue.use(AuthPlugin);

// Firebase
import "@/firebase/firebaseConfig";

// ACL
import acl from "./acl/acl";

// Vue-websocket
import VueWebsocket from "vue-websocket";
import { SERVER_URL } from "./utils/constant";
Vue.use(VueWebsocket, SERVER_URL, { reconnection: true });

// Vuesax Admin Filters
import "./filters/filters";

Vue.config.productionTip = false;

new Vue({
  router,
  acl,
  store,
  render: h => h(App)
}).$mount("#app");
