import archerApi from "@/api/archer";

export default {
  async getArcherList({ commit }, userId) {
    const archers = await archerApi.list(userId);
    // console.log(archers);
    commit("SET_ARCHERS", archers);
  }
};
