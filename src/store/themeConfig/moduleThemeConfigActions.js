import themeConfigApi from "@/api/themeSetting"
export default {
  async getInfo({ commit }) {
    const response = await themeConfigApi.getThemeSetting()
    console.log(response)
    commit("UPDATE_PRIMARY_COLOR", response.primaryColor)
    commit("UPDATE_THEME", response.theme)
    commit("TOGGLE_REDUCE_BUTTON", response.sidebarCollapsed)
    commit("UPDATE_NAVBAR_COLOR", response.navbarColor)
    commit("UPDATE_NAVBAR_TYPE", response.navbarType)
  }
}