export default {
  adminNotificationList: state => {
    let notifications = [];

    state.adminNotifications.forEach((notification, index) => {
      let title = "",
        icon = "",
        category = "",
        featherIcon = "";
      if (notification.category === 0) {
        title = "New user registered";
        icon = "UserIcon";
        category = "primary";
        featherIcon = "icon-user";
      }
      notifications.push({
        index: index,
        title: title,
        msg: notification.message,
        icon: icon,
        time: notification.createdAt,
        category: category,
        id: notification._id,
        featherIcon: featherIcon
      });
    });

    return notifications;
  },
  userNotificationList: state => {
    let notifications = [];

    state.userNotifications.forEach((notification, index) => {
      let title = "",
        icon = "",
        category = "",
        featherIcon = "";
      if (notification.category === 0) {
        title = "New user registered";
        icon = "UserIcon";
        category = "primary";
        featherIcon = "icon-user";
      } else if (notification.category === 1) {
        title = "HelpDesk Ticket invite";
        icon = "Share2Icon";
        category = "success";
        featherIcon = "icon-share-2";
      } else if (notification.category === 2) {
        title = "New Message";
        icon = "MessageSquareIcon";
        category = "warning";
        featherIcon = "icon-message-square";
      }
      notifications.push({
        index: index,
        title: title,
        msg: notification.message,
        icon: icon,
        time: notification.createdAt,
        category: category,
        id: notification._id,
        featherIcon: featherIcon,
        link: notification.link
      });
    });

    return notifications;
  }
};
