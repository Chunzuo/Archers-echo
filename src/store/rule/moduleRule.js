import state from "./moduleRuleState.js";
import mutations from "./moduleRuleMutations.js";
import actions from "./moduleRuleActions.js";

export default {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions
};
