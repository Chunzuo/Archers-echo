import notificationApi from "@/api/notification";

export default {
  async getAdminNotificationList({ commit }) {
    const notifications = await notificationApi.getAdminNotifications();
    commit("SET_ADMIN_NOTIFICATION_LIST", notifications);
  },
  async removeAdminNotification({ commit }, item) {
    await notificationApi.removeNotification(item.id);
    commit("REMOVE_ADMIN_NOTIFICATION", item);
    item.notify({
      title: "Success",
      text: "Successfully remove notification",
      iconPack: "feather",
      icon: "icon-check",
      color: "success"
    });
  },
  async getUserNotificationList({ commit }, userId) {
    const notifications = await notificationApi.getByUserId(userId);
    commit("SET_USER_NOTIFICATION_LIST", notifications);
  },
  async removeUserNotification({ commit }, item) {
    // console.log("__RemoveUserNotification");
    await notificationApi.removeNotification(item.id);
    commit("REMOVE_USER_NOTIFICATION", item);
    if (item.notify) {
      item.notify({
        title: "Success",
        text: "Successfully remove notification",
        iconPack: "feather",
        icon: "icon-check",
        color: "success"
      });
    }
  },
  readNotifyMessage({ commit, state, dispatch }, channelId) {
    commit("READ_NOTIFY_MESSAGE", channelId);
    if (state.notificationToDelete) {
      dispatch("removeUserNotification", state.notificationToDelete);
    }
  },
  removeByIdentify({ commit, state }, identify) {
    let newArray = [];
    let deleteNtfIds = [];
    state.userNotifications.forEach(notification => {
      if (notification.identify !== identify) {
        newArray.push(notification);
      } else {
        console.log(notification);
        deleteNtfIds.push(notification._id);
      }
    });
    commit("SET_USER_NOTIFICATION_LIST", newArray);
    notificationApi.removeMultiNotification(deleteNtfIds);
  },
  async removeByUserId({ commit }, data) {
    try {
      await notificationApi.removeByUser(data.userId);
      data.notify({
        title: "Success",
        text: "Successfully remove notification",
        iconPack: "feather",
        icon: "icon-check",
        color: "success"
      });
    } catch (error) {
      data.notify({
        title: "Error",
        text: error.message,
        iconPack: "feather",
        icon: "icon-alert-circle",
        color: "danger"
      });
    }
    commit("SET_USER_NOTIFICATION_LIST", []);
  }
};
