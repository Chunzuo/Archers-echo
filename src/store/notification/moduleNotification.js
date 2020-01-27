import state from "./moduleNotificationState.js";
import mutations from "./moduleNotificationMutations.js";
import actions from "./moduleNotificationActions.js";
import getters from "./moduleNotificationGetters.js";

export default {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
};
