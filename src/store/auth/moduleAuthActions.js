/*=========================================================================================
  File Name: moduleAuthActions.js
  Description: Auth Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import firebase from "firebase/app";
import "firebase/auth";
import router from "@/router";
import authApi from "@/api/auth";
import userApi from "@/api/user";

export default {
  loginAttempt({ dispatch }, payload) {
    const newPayload = {
      userDetails: payload.userDetails,
      notify: payload.notify,
      id: payload.userId,
      role: payload.role,
      email: payload.email,
      socket: payload.socket
    };
    if (!payload.checkbox_remember_me) {
      // localStorage.setItem('remember_me', false);
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(function() {
          dispatch("login", newPayload);
        })
        .catch(function(err) {
          payload.notify({
            time: 2500,
            title: "Error",
            text: err.message,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger"
          });
        });
    } else {
      // localStorage.setItem('remember_me', true);
      dispatch("login", newPayload);
    }
  },
  login({ commit, state }, payload) {
    if (state.isUserLoggedIn()) {
      payload.notify({
        title: "Login Attempt",
        text: "You are already logged in!",
        iconPack: "feather",
        icon: "icon-alert-circle",
        color: "warning"
      });
      return false;
    }

    firebase
      .auth()
      .signInWithEmailAndPassword(
        payload.userDetails.email,
        payload.userDetails.password
      )
      .then(
        async result => {
          let user_info = result.user.providerData[0];
          user_info["id"] = payload.id;
          user_info["role"] = payload.role;

          await userApi.updateSocketId({
            userId: payload.id,
            socketId: payload.socket.id
          });

          router.push(payload.role === 1 ? "/admin/home" : "/user/home");

          commit("UPDATE_AUTHENTICATED_USER", user_info);
        },
        err => {
          payload.notify({
            time: 3500,
            title: "Error",
            text: err.message,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger"
          });

          commit("UPDATE_LOGIN_STATUS", !state.loginFailed);
          authApi.updateLoginAttempt({ email: payload.email });
        }
      );
  },

  // Google Login
  loginWithGoogle({ commit, state }, payload) {
    if (state.isUserLoggedIn()) {
      payload.notify({
        title: "Login Attempt",
        text: "You are already logged in!",
        iconPack: "feather",
        icon: "icon-alert-circle",
        color: "warning"
      });
      return false;
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        let user_info = result.user.providerData[0];
        const data = {
          provider: user_info.providerId,
          email: user_info.email
        };
        authApi.login(data).then(
          response => {
            if (response.isActive) {
              user_info["id"] = response._id;
              router.push(router.currentRoute.query.to || "/");
              commit("UPDATE_AUTHENTICATED_USER", user_info);
            } else {
              payload.notify({
                color: "warning",
                title: "Warning",
                text: "This user is not activated yet.",
                iconPack: "feather",
                icon: "icon-alert-triangle"
              });
            }
          },
          error => {
            payload.notify({
              title: "Error",
              text: error.message,
              iconPack: "feather",
              icon: "icon-alert-circle",
              color: "danger"
            });
          }
        );
      })
      .catch(err => {
        payload.notify({
          time: 2500,
          title: "Error",
          text: err.message,
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "danger"
        });
      });
  },

  // Facebook Login
  loginWithFacebook({ commit, state }, payload) {
    if (state.isUserLoggedIn()) {
      payload.notify({
        title: "Login Attempt",
        text: "You are already logged in!",
        iconPack: "feather",
        icon: "icon-alert-circle",
        color: "warning"
      });
      return false;
    }
    const provider = new firebase.auth.FacebookAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        router.push(router.currentRoute.query.to || "/");
        commit("UPDATE_AUTHENTICATED_USER", result.user.providerData[0]);
      })
      .catch(err => {
        payload.notify({
          time: 2500,
          title: "Error",
          text: err.message,
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "danger"
        });
      });
  },

  // Twitter Login
  loginWithTwitter({ commit, state }, payload) {
    if (state.isUserLoggedIn()) {
      payload.notify({
        title: "Login Attempt",
        text: "You are already logged in!",
        iconPack: "feather",
        icon: "icon-alert-circle",
        color: "warning"
      });
      return false;
    }
    const provider = new firebase.auth.TwitterAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        router.push(router.currentRoute.query.to || "/");
        commit("UPDATE_AUTHENTICATED_USER", result.user.providerData[0]);
      })
      .catch(err => {
        payload.notify({
          time: 2500,
          title: "Error",
          text: err.message,
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "danger"
        });
      });
  },

  // Github Login
  loginWithGithub({ commit, state }, payload) {
    if (state.isUserLoggedIn()) {
      payload.notify({
        title: "Login Attempt",
        text: "You are already logged in!",
        iconPack: "feather",
        icon: "icon-alert-circle",
        color: "warning"
      });
      return false;
    }
    const provider = new firebase.auth.GithubAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        router.push(router.currentRoute.query.to || "/");
        commit("UPDATE_AUTHENTICATED_USER", result.user.providerData[0]);
      })
      .catch(err => {
        payload.notify({
          time: 2500,
          title: "Error",
          text: err.message,
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "danger"
        });
      });
  },
  updateAuthenticatedUser({ commit }, payload) {
    commit("UPDATE_AUTHENTICATED_USER", payload);
  },
  getUserName({ commit }) {
    const userName = localStorage.getItem("userName");
    console.log(userName);
    commit("UPDATE_USERNAME", userName);
  }
};
