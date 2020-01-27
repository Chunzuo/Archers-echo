<!-- =========================================================================================
    File Name: ChatLog.vue
    Description: Chat Application - Log of chat
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->
<!-- hasSentPreviousMsg -->
<template>
  <div id="component-chat-log" class="m-8" v-if="chatData">
    <div v-for="(msg, index) in chatData" class="msg-grp-container" :key="index">
      <!-- If previouse msg is older than current time -->
      <template v-if="chatData[index-1]">
        <vs-divider v-if="!isSameDay(msg.time, chatData[index-1].time)">
          <span>{{ toDate(msg.time) }}</span>
        </vs-divider>
      </template>
      <template v-if="index == 0">
        <vs-divider>
          <span>{{toDate(msg.time)}}</span>
        </vs-divider>
      </template>

      <div
        class="flex items-start"
        :class="[{'flex-row-reverse' : isMine(msg.sender._id)}]"
        v-if="channelId"
      >
        <template v-if="chatData[index-1]">
          <template
            v-if="(!hasSentPreviousMsg(chatData[index-1].sender._id, msg.sender._id) || !isSameDay(msg.time, chatData[index-1].time))"
          >
            <vs-avatar
              size="40px"
              class="m-0 flex-no-shrink"
              :class="isMine(msg.sender._id) ? 'sm:ml-5 ml-3' : 'sm:mr-5 mr-3'"
              :text="msg.sender.email.split('@')[0]"
            ></vs-avatar>
          </template>
        </template>

        <template v-if="index == 0">
          <vs-avatar
            size="40px"
            class="m-0 flex-no-shrink"
            :class="isMine(msg.sender._id) ? 'sm:ml-5 ml-3' : 'sm:mr-5 mr-3'"
            :text="msg.sender.email.split('@')[0]"
          ></vs-avatar>
        </template>

        <template v-if="chatData[index-1]">
          <div
            class="mr-16"
            v-if="!(!hasSentPreviousMsg(chatData[index-1].sender._id, msg.sender._id) || !isSameDay(msg.time, chatData[index-1].time))"
          ></div>
        </template>

        <div
          class="msg break-words relative shadow-md rounded py-3 px-4 mb-2 rounded-lg max-w-sm"
          :class="{'bg-primary-gradient text-white': isMine(msg.sender._id), 'border border-solid border-grey-light bg-white': !isMine(msg.sender._id)}"
        >
          <span>{{ msg.content }}</span>
        </div>
      </div>

      <div
        class="flex items-start"
        :class="[{'flex-row-reverse' : isMine(msg.sender)}]"
        v-if="userId"
      >
        <template v-if="chatData[index-1]">
          <template
            v-if="(!hasSentPreviousMsg(chatData[index-1].sender, msg.sender) || !isSameDay(msg.time, chatData[index-1].time))"
          >
            <vs-avatar
              size="40px"
              class="m-0 flex-no-shrink"
              :class="isMine(msg.sender) ? 'sm:ml-5 ml-3' : 'sm:mr-5 mr-3'"
              :text="getUserEmail(msg.sender)"
            ></vs-avatar>
          </template>
        </template>

        <template v-if="index == 0">
          <vs-avatar
            size="40px"
            class="m-0 flex-no-shrink"
            :class="isMine(msg.sender) ? 'sm:ml-5 ml-3' : 'sm:mr-5 mr-3'"
            :text="getUserEmail(msg.sender)"
          ></vs-avatar>
        </template>

        <template v-if="chatData[index-1]">
          <div
            class="mr-16"
            v-if="!(!hasSentPreviousMsg(chatData[index-1].sender, msg.sender) || !isSameDay(msg.time, chatData[index-1].time))"
          ></div>
        </template>

        <div
          class="msg break-words relative shadow-md rounded py-3 px-4 mb-2 rounded-lg max-w-sm"
          :class="{'bg-primary-gradient text-white': isMine(msg.sender), 'border border-solid border-grey-light bg-white': !isMine(msg.sender)}"
        >
          <span>{{ msg.content }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["channelId", "userId"],
  data() {
    return {};
  },
  computed: {
    hasSentPreviousMsg() {
      return (last_sender, current_sender) => last_sender == current_sender;
    },
    user() {
      return JSON.parse(localStorage.getItem("userInfo"));
    },
    chatData() {
      // console.log(this.$store.state.chat.channels);
      if (this.channelId) {
        return this.$store.state.chat.channels.find(i => {
          return i.id === this.channelId;
        }).messages;
      }
      if (this.userId) {
        console.log(
          this.$store.state.chat.contacts.find(i => {
            return i.id === this.userId;
          }).msg
        );
        return this.$store.state.chat.contacts.find(i => {
          return i.id === this.userId;
        }).msg;
      }
      // console.log(this.$store.state.chat.channelLogs);
      // return this.$store.state.chat.channelLogs;
    }
  },
  watch: {
    chatData() {
      this.$vs.loading.close("#div-chatlog > .con-vs-loading");
    }
  },
  methods: {
    isSameDay(time_to, time_from) {
      const date_time_to = new Date(Date.parse(time_to));
      const date_time_from = new Date(Date.parse(time_from));
      return (
        date_time_to.getFullYear() === date_time_from.getFullYear() &&
        date_time_to.getMonth() === date_time_from.getMonth() &&
        date_time_to.getDate() === date_time_from.getDate()
      );
    },
    toDate(time) {
      const locale = "en-us";
      const date_obj = new Date(Date.parse(time));
      const monthName = date_obj.toLocaleString(locale, {
        month: "short"
      });
      return date_obj.getDate() + " " + monthName;
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$parent.$el.scrollTop = this.$parent.$el.scrollHeight;
      });
    },
    isMine(userId) {
      return this.user.id === userId;
    },
    getUserEmail(sender) {
      // console.log("Sender: " + sender);
      // console.log("Receiver: " + receiver);
      if (this.isMine(sender)) {
        return "Me";
      } else {
        return this.$store.state.chat.contacts
          .find(i => {
            return i.id === sender;
          })
          .email.split("@")[0];
      }
    }
  },
  updated() {
    this.scrollToBottom();
    // console.log("ChatLog updated");
  },
  mounted() {
    this.scrollToBottom();
    // console.log("Chatlog mounted");
    // this.$vs.loading({
    //   container: "#div-chatlog",
    //   type: "sound"
    // });
  }
};
</script>
