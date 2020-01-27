import state from "./moduleAuthState.js";
import mutations from "./moduleAuthMutations.js";
import actions from "./moduleAuthActions.js";

export default {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions
};
