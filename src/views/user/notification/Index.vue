<template>
  <div id="div-loading" class="vs-con-loading__container">
    <vs-button @click="$router.go(-1)" type="flat" icon="arrow_back">back</vs-button>
    <vx-card title="Notifications">
      <vs-button
        class="mb-6"
        type="border"
        @click="removeAllNotification"
        v-if="notifications.length > 0"
      >Remove all notification</vs-button>
      <span v-if="notifications.length === 0">No notifications</span>
      <vs-alert
        class="mt-2"
        :color="notification.category"
        :title="getTitle(notification)"
        active="true"
        closable
        icon-pack="feather"
        close-icon="icon-x"
        :icon="notification.featherIcon"
        v-for="(notification, index) in notifications"
        :key="index"
        @click="removeNotification(notification)"
      >{{notification.msg}}</vs-alert>
    </vx-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: JSON.parse(localStorage.getItem("userInfo")).id
    };
  },
  mounted() {
    this.$store.dispatch("notification/getUserNotificationList", this.userId);
  },
  computed: {
    notifications() {
      return this.$store.getters["notification/userNotificationList"];
    }
  },
  methods: {
    async removeNotification(item) {
      item["notify"] = this.$vs.notify;
      this.$store.dispatch("notification/removeUserNotification", item);
    },
    getTitle(notification) {
      return (
        notification.title + " (" + this.elapsedTime(notification.time) + ") "
      );
    },
    elapsedTime(startTime) {
      let x = new Date(startTime);
      let now = new Date();
      var timeDiff = now - x;
      timeDiff /= 1000;

      var seconds = Math.round(timeDiff);
      timeDiff = Math.floor(timeDiff / 60);

      var minutes = Math.round(timeDiff % 60);
      timeDiff = Math.floor(timeDiff / 60);

      var hours = Math.round(timeDiff % 24);
      timeDiff = Math.floor(timeDiff / 24);

      var days = Math.round(timeDiff % 365);
      timeDiff = Math.floor(timeDiff / 365);

      var years = timeDiff;

      if (years > 0) {
        return years + (years > 1 ? " Years " : " Year ") + "ago";
      } else if (days > 0) {
        return days + (days > 1 ? " Days " : " Day ") + "ago";
      } else if (hours > 0) {
        return hours + (hours > 1 ? " Hrs " : " Hour ") + "ago";
      } else if (minutes > 0) {
        return minutes + (minutes > 1 ? " Mins " : " Min ") + "ago";
      } else if (seconds > 0) {
        return seconds + (seconds > 1 ? `${seconds} sec ago` : "just now");
      }

      return "Just Now";
    },
    removeAllNotification() {
      const data = {
        userId: this.userId,
        notify: this.$vs.notify
      };
      this.$store.dispatch("notification/removeByUserId", data);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>