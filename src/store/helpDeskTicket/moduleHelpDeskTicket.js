import state from "./moduleHelpDeskTicketState.js";
import mutations from "./moduleHelpDeskTicketMutations.js";
import actions from "./moduleHelpDeskTicketActions.js";
import getters from "./moduleHelpDeskTicketGetters.js";

export default {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
};
