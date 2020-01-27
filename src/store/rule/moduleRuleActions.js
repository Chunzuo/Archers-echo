import ruleApi from "@/api/rule";

export default {
  async getRuleList({ commit }) {
    const rules = await ruleApi.list();
    commit("SET_RULE_LIST", rules);
  }
};
