export default {
  SET_ADMIN_NOTIFICATION_LIST(state, data) {
    state.adminNotifications = data;
  },
  REMOVE_ADMIN_NOTIFICATION(state, item) {
    const index = state.adminNotifications.findIndex(
      i => i.index === item.index
    );
    state.adminNotifications.splice(index, 1);
  },
  SET_USER_NOTIFICATION_LIST(state, data) {
    state.userNotifications = data;
  },
  REMOVE_USER_NOTIFICATION(state, item) {
    const index = state.userNotifications.findIndex(
      i => i.index === item.index
    );
    state.userNotifications.splice(index, 1);
  },
  UPDATE_USER_NOTIFICATION_LIST(state, data) {
    state.userNotifications.push(data);
  },
  READ_NOTIFY_MESSAGE(state, channelId) {
    const index = state.userNotifications.findIndex(
      i => i.channelId === channelId
    );
    if (index < 0) return;
    console.log(index);
    console.log(state.userNotifications[index]);
    state.notificationToDelete = state.userNotifications[index];
    state.userNotifications.splice(index, 1);
  },
  REMOVE_BY_IDENTIFY(state, identify) {
    console.log(identify);
    console.log(state.userNotifications);
    let newArray = [];
    state.userNotifications.forEach(notification => {
      if (notification.identify !== identify) {
        newArray.push(notification);
      }
    });
    state.userNotifications = newArray;
  }
};
