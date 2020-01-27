import helpDeskTicketApi from "@/api/helpDesk";

export default {
  async getHelpDeskTicketList({ commit }, userId) {
    const response = await helpDeskTicketApi.getMyHelpDeskTickets(userId);
    commit("SET_TICKET_LIST", response);
  }
};
