export default {
  ticketList(state) {
    return state.tickets.filter(ticket => {
      return (
        ticket.name.indexOf(state.filter.keyword) > -1 &&
        (state.filter.status === -1
          ? true
          : ticket.status === state.filter.status)
      );
    });
  }
};
