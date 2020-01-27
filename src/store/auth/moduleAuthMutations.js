export default {
  UPDATE_AUTHENTICATED_USER(state, user) {
    localStorage.setItem("userInfo", JSON.stringify(user));
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userName", user.displayName);
    state.userName = user.displayName;
  },
  UPDATE_LOGIN_STATUS(state, status) {
    state.loginFailed = status;
  },
  UPDATE_USERNAME(state, username) {
    state.userName = username;
  }
};
