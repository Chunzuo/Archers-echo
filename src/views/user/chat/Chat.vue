<!-- =========================================================================================
    File Name: Chat.vue
    Description: Chat Application - Stay connected
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div id="chat-app" class="border border-solid border-grey-light rounded relative overflow-hidden">
    <vs-sidebar
      class="items-no-padding"
      parent="#chat-app"
      :click-not-close="clickNotClose"
      :hidden-background="clickNotClose"
      v-model="isChatSidebarActive"
      id="chat-list-sidebar"
    >
      <!-- USER PROFILE SIDEBAR -->
      <user-profile
        :active="activeProfileSidebar"
        :userId="userProfileId"
        class="user-profile-container"
        @closeProfileSidebar="closeProfileSidebar"
      ></user-profile>
      <group-detail
        class="user-profile-container"
        :active="activeChannelSidebar"
        :channelId="activeChannel"
        @closeChannelSidebar="closeChannelSidebar"
      ></group-detail>

      <div class="chat__profile-search flex p-4">
        <div class="relative inline-flex">
          <vs-avatar
            class="m-0"
            v-if="activeUserImg.startsWith('http')"
            :src="activeUserImg"
            size="40px"
            @click="showProfileSidebar(activeUserId)"
          ></vs-avatar>
          <vs-avatar
            v-else
            class="m-0"
            :src="require(`@/assets/images/avatar/${activeUserImg}`)"
            size="40px"
          />
          <div
            class="h-3 w-3 border-white border border-solid rounded-full absolute pin-r pin-b"
            :class="'bg-' + getStatusColor(true)"
          ></div>
        </div>
        <vs-input
          icon="icon-search"
          icon-pack="feather"
          class="w-full mx-5 input-rounded-full no-icon-border"
          placeholder="Search or start a new chat"
          v-model="searchQuery"
        />
      </div>

      <vs-divider class="border-grey-light m-0"/>
      <VuePerfectScrollbar class="chat-scroll-area pt-4" :settings="settings">
        <!-- ACTIVE CHATS LIST -->
        <div class="chat__chats-list mb-8">
          <h3 class="text-primary mb-5 px-4">Channels</h3>
          <ul class="chat__active-chats bordered-items">
            <li
              class="cursor-pointer"
              v-for="(channel, index) in channels"
              :key="index"
              @click="updateActiveChannel(channel.id)"
            >
              <chat-group :data="channel" :isActiveChannel="isActiveChannel(channel.id)"></chat-group>
            </li>
          </ul>
        </div>

        <!-- CONTACTS LIST -->
        <div class="chat__contacts">
          <h3 class="text-primary mb-5 px-4">Direct Messages</h3>
          <ul class="chat__contacts bordered-items">
            <li
              class="cursor-pointer"
              v-for="contact in chatContacts"
              :key="contact.id"
              @click="updateActiveChatUser(contact.id)"
            >
              <chat-contact :contact="contact" :isActiveUser="isActiveUser(contact.id)"></chat-contact>
            </li>
          </ul>
        </div>
      </VuePerfectScrollbar>
    </vs-sidebar>

    <!-- RIGHT COLUMN -->
    <div
      class="chat__bg app-fixed-height chat-content-area border border-solid border-grey-light border-t-0 border-r-0 border-b-0"
      :class="{'sidebar-spacer--wide': clickNotClose, 'flex items-center justify-center': activeChannel === null && activeContact === null}"
    >
      <template v-if="activeChannel || activeContact">
        <div class="chat__navbar">
          <chat-navbar
            :isSidebarCollapsed="!clickNotClose"
            :channelId="activeChannel"
            :userId="activeContact"
            :isPinnedProp="isChatPinned"
            @openContactsSidebar="toggleChatSidebar(true)"
            @showProfileSidebar="updateUserProfileId"
            @toggleIsChatPinned="toggleIsChatPinned"
            @showChannelSidebar="updateChannelId"
          ></chat-navbar>
        </div>
        <VuePerfectScrollbar
          class="chat-content-scroll-area border border-solid border-grey-light vs-con-loading__container"
          :settings="settings"
          ref="chatLogPS"
          id="div-chatlog"
        >
          <div class="chat__log" ref="chatLog">
            <chat-log
              :channelId="activeChannel"
              :userId="activeContact"
              v-if="activeChannel || activeContact"
            ></chat-log>
          </div>
        </VuePerfectScrollbar>
        <div class="chat__input flex p-4 bg-white">
          <vs-input
            class="flex-1"
            placeholder="Type Your Message"
            v-model="typedMessage"
            @keyup.enter="sendMsg"
          />
          <vs-button class="bg-primary-gradient ml-4" type="filled" @click="sendMsg">Send</vs-button>
        </div>
      </template>
      <template v-else>
        <div class="flex flex-col items-center">
          <feather-icon
            icon="MessageSquareIcon"
            class="mb-4 bg-white p-8 shadow-md rounded-full"
            svgClasses="w-16 h-16"
          ></feather-icon>
          <h4
            class="py-2 px-4 bg-white shadow-md rounded-full cursor-pointer"
            @click.stop="toggleChatSidebar(true)"
          >Start Conversation</h4>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import contacts from "./contacts";
import ChatContact from "./ChatContact.vue";
import UserProfile from "./UserProfile.vue";
import ChatNavbar from "./ChatNavbar.vue";
import ChatLog from "./ChatLog.vue";
import ChatGroup from "./ChatGroup.vue";
import GroupDetail from "./GroupDetail.vue";

export default {
  name: "vx-sidebar",
  data() {
    return {
      active: true,
      isHidden: false,
      contacts: contacts,
      searchContact: "",
      activeProfileSidebar: false,
      activeChatUser: null,
      userProfileId: -1,
      typedMessage: "",
      isChatPinned: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.7
      },
      clickNotClose: true,
      isChatSidebarActive: true,
      windowWidth: window.innerWidth,
      activeChannel: null,
      activeChannelSidebar: false,
      activeContact: null
    };
  },
  computed: {
    chatLastMessaged() {
      return userId => this.$store.getters["chat/chatLastMessaged"](userId);
    },
    chatUnseenMessages() {
      return userId => {
        const unseenMsg = this.$store.getters["chat/chatUnseenMessages"](
          userId
        );
        if (unseenMsg) return unseenMsg;
      };
    },
    sorted() {
      return this.chats.slice().sort((x, y) => {
        const xId = x.id;
        const yId = y.id;
        const chatDataX = this.$store.getters["chat/chatDataOfUser"](xId);
        const chatDataY = this.$store.getters["chat/chatDataOfUser"](yId);
        return chatDataY.isPinned - chatDataX.isPinned;
      });
    },
    activeUserId() {
      return this.$store.state.AppActiveUser.id;
    },
    activeUserStatus() {
      return this.$store.state.AppActiveUser.status;
    },
    getStatusColor() {
      return isActiveUser => {
        const userStatus = this.getUserStatus(isActiveUser);

        if (userStatus == "online") {
          return "success";
        } else if (userStatus == "do not disturb") {
          return "danger";
        } else if (userStatus == "away") {
          return "warning";
        } else {
          return "grey";
        }
      };
    },
    chats() {
      return this.$store.getters["chat/chats"];
    },
    chatContacts() {
      return this.$store.getters["chat/contacts"];
      // return this.$store.getters["chat/chatcontacts"];
    },
    searchQuery: {
      get() {
        return this.$store.state.chat.chatSearchQuery;
      },
      set(val) {
        this.$store.dispatch("chat/setChatSearchQuery", val);
      }
    },
    isActiveChatUser() {
      return userId => userId == this.activeChatUser;
    },
    user() {
      return JSON.parse(localStorage.getItem("userInfo"));
    },
    channels() {
      return this.$store.getters["chat/channels"];
      // return this.$store.state.chat.channels;
    },
    isActiveChannel() {
      return channelIndex => channelIndex == this.activeChannel;
    },
    activeUserImg() {
      return (
        JSON.parse(localStorage.getItem("userInfo")).photoURL || "default.png"
      );
    },
    isActiveUser() {
      return contactId => contactId == this.activeContact;
    }
  },
  methods: {
    getUserStatus(isActiveUser) {
      return isActiveUser
        ? this.$store.state.AppActiveUser.status
        : this.contacts[this.activeChatUser].status;
    },
    closeProfileSidebar(value) {
      this.activeProfileSidebar = value;
    },
    updateUserProfileId(userId) {
      this.userProfileId = userId;
      this.activeProfileSidebar = !this.activeProfileSidebar;
    },
    updateChannelId(channelId) {
      this.activeChannel = channelId;
      this.activeChannelSidebar = !this.activeChannelSidebar;
    },
    updateActiveChatUser(contactId) {
      // this.activeChatUser = contactId;
      this.activeContact = contactId;
      this.activeChannel = null;
      this.$store.dispatch("chat/readDirectMessage", {
        sender: contactId,
        receiver: this.user.id
      });
      // this.$store.commit("notification/REMOVE_BY_IDENTIFY", contactId);
      this.$store.dispatch("notification/removeByIdentify", contactId);

      // if (this.$store.getters["chat/chatDataOfUser"](this.activeChatUser)) {
      //   this.$store.dispatch("chat/markSeenAllMessages", contactId);
      // }
      // let chatData = this.$store.getters["chat/chatDataOfUser"](
      //   this.activeChatUser
      // );
      // if (chatData) this.isChatPinned = chatData.isPinned;
      // else this.isChatPinned = false;
      // this.toggleChatSidebar();
      // this.typedMessage = "";
    },
    showProfileSidebar(userId) {
      this.userProfileId = userId;
      this.activeProfileSidebar = !this.activeProfileSidebar;
    },
    showChannelSidebar(channelId) {
      console.log(channelId);
      this.activeChannel = channelId;
      console.log(this.activeChannelSidebar);
      this.activeChannelSidebar = !this.activeChannelSidebar;
    },
    sendMsg() {
      if (!this.typedMessage) return;
      let data = {
        content: this.typedMessage,
        sender: this.user.id,
        time: new Date()
      };
      // Channel message
      if (this.activeChannel) {
        data["channelId"] = this.activeChannel;
        this.$socket.emit("REQ_SEND_CHANNEL_MESSAGE", data);
        data.sender = {
          _id: this.user.id,
          email: this.user.email
        };
        this.$store.commit("chat/UPDATE_CHANNEL_LOGS", data);
      }
      // Direct message
      if (this.activeContact) {
        data["receiver"] = {
          id: this.activeContact
        };
        data["senderEmail"] = this.user.email;
        this.$socket.emit("REQ_SEND_DIRECT_MESSAGE", data);
        this.$store.commit("chat/UPDATE_DIRECT_MESSAGE_LOGS", data);
      }
      this.typedMessage = "";
      this.$refs.chatLogPS.$el.scrollTop = this.$refs.chatLog.scrollHeight;
    },
    toggleIsChatPinned(value) {
      this.isChatPinned = value;
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth;
      this.setSidebarWidth();
    },
    setSidebarWidth() {
      if (this.windowWidth < 1200) {
        this.isChatSidebarActive = this.clickNotClose = false;
      } else {
        this.isChatSidebarActive = this.clickNotClose = true;
      }
    },
    toggleChatSidebar(value = false) {
      if (!value && this.clickNotClose) return;
      this.isChatSidebarActive = value;
    },
    updateActiveChannel(channelId) {
      this.activeChannel = channelId;
      // console.log(channelId);
      // Get Chat History
      // this.$store.dispatch("chat/getChannelMessageLog", channelId);
      // Unmark unread messages
      this.$store.dispatch("chat/readUnreadChannelMessage", {
        channelId: channelId,
        userId: this.user.id
      });
      // Remove message notifications
      // this.$store.dispatch("notification/readNotifyMessage", channelId);
      // this.$store.commit("notification/REMOVE_BY_IDENTIFY", channelId);
      this.$store.dispatch("notification/removeByIdentify", channelId);
      this.activeContact = null;
    },
    closeChannelSidebar(value) {
      this.activeChannelSidebar = value;
    }
  },
  components: {
    VuePerfectScrollbar,
    ChatContact,
    UserProfile,
    ChatNavbar,
    ChatLog,
    ChatGroup,
    GroupDetail
  },
  created() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.handleWindowResize);
    });
    this.setSidebarWidth();

    const data = {
      id: this.user.id,
      email: this.user.email
    };
    this.$store.dispatch("chat/getChannels", data);
    this.$store.dispatch("chat/getContacts", this.user.id);
  },
  beforeDestroy: function() {
    window.removeEventListener("resize", this.handleWindowResize);
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/vuesax/apps/chat.scss";
</style>