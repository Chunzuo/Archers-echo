/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  Object Strucutre:
  					path => router path
  					name => router name
  					component(lazy loading) => component to load
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Version: 1.1
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import Vue from "vue";
import Router from "vue-router";
import auth from "../auth/authService";
import firebase from "firebase/app";
import "firebase/auth";

import userRoute from "./user";
import adminRoute from "./admin";

Vue.use(Router);

const router = new Router({
  base: process.env.BASE_URL,
  mode: "history",
  routes: [
    {
      path: "/",
      redirect:
        parseInt(localStorage.getItem("userRole")) === 1
          ? "/admin/home"
          : "/user/home"
    },
    userRoute,
    adminRoute,
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
    {
      path: "",
      component: () => import("@/layouts/full-page/FullPage.vue"),
      children: [
        // =============================================================================
        // COMMON PAGES
        // =============================================================================
        {
          path: "/login",
          name: "login",
          component: () => import("@/views/common/Login.vue"),
          meta: { rule: "common" }
        },
        {
          path: "/register",
          name: "register",
          component: () => import("@/views/common/Register.vue"),
          meta: { rule: "common" }
        },
        {
          path: "/pages/error-404",
          name: "pageError404",
          component: () => import("@/views/common/Error404.vue"),
          meta: { rule: "common" }
        },
        {
          path: "/pages/not-authorized",
          name: "pageNotAuthorized",
          component: () => import("@/views/common/NotAuthorized.vue"),
          meta: { rule: "common" }
        },
        {
          path: "/pages/forgot-password",
          name: "forgotPassword",
          component: () => import("@/views/common/ForgotPassword.vue"),
          meta: { rule: "common" }
        }
      ]
    },
    // Redirect to 404 page, if no match found
    {
      path: "*",
      redirect: "/common/error-404"
    }
  ]
});

router.beforeEach((to, from, next) => {
  firebase.auth().onAuthStateChanged(() => {
    // get firebase current user
    const firebaseCurrentUser = firebase.auth().currentUser;

    if (
      to.path === "/login" ||
      to.path === "/register" ||
      to.path === "/pages/forgot-password" ||
      to.path === "/pages/error-404" ||
      (auth.isAuthenticated() || firebaseCurrentUser)
    ) {
      return next();
    }

    router.push({ path: "/login", query: { to: to.path } });
  });
});

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

export default router;
