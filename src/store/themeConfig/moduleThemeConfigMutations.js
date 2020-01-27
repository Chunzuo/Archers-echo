export default {
  UPDATE_PRIMARY_COLOR(state, val) {
    state.primaryColor = val
  },
  UPDATE_THEME(state, val) {
    state.theme = val
  },
  TOGGLE_REDUCE_BUTTON(state, val) {
    state.sidebarCollapsed = val
  },
  UPDATE_NAVBAR_COLOR(state, val) {
    state.navbarColor = val
  },
  UPDATE_NAVBAR_TYPE(state, val) {
    state.navbarType = val
  },
  UPDATE_FOOTER_TYPE(state, val) {
    state.footerType = val
  },
  UPDATE_HIDE_SCROLL_TOP(state, val) {
    state.hideScrollToTop = val
  },
  UPDATE_ROUTER_TRANSITION(state, val) {
    state.routerTransition = val
  }
}