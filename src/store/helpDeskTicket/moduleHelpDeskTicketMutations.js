export default {
  SET_TICKET_LIST(state, data) {
    state.tickets = data;
  },
  SET_FILTER_KEYWORD(state, keyword) {
    state.filter.keyword = keyword;
  },
  SET_FILTER_STATUS(state, status) {
    state.filter.status = status;
  }
};
