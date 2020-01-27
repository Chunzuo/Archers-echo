<!-- =========================================================================================
    File Name: ChatNavbar.vue
    Description: Chat Application - Chat navbar
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div v-if="channelId != null || userId != null" class="chat__header">
    <vs-navbar class="p-4 flex navbar-custom" color="white" type="flat">
      <div class="relative flex mr-4">
        <feather-icon
          icon="MenuIcon"
          class="mr-4 cursor-pointer"
          v-if="isSidebarCollapsed"
          @click.stop="$emit('openContactsSidebar')"
        ></feather-icon>
        <!-- <vs-avatar
          class="m-0"
          size="40px"
          :src="require(`@/assets/images/portrait/small/${userImg}`)"
          @click.stop="$emit('showProfileSidebar', userId)"
        />-->
        <vs-avatar
          class="m-0"
          size="40px"
          icon-pack="feather"
          :icon="channelId ? 'icon-users' : 'icon-user'"
          @click.stop="showSidebar"
        ></vs-avatar>
      </div>
      <h6>{{ name }}</h6>
      <vs-spacer></vs-spacer>
    </vs-navbar>
  </div>
</template>

<script>
import contacts from "./contacts";

export default {
  props: ["channelId", "isPinnedProp", "isSidebarCollapsed", "userId"],
  data() {
    return {
      contacts: contacts,
      isPinnedLocal: this.isPinnedProp
    };
  },
  watch: {
    isPinnedProp(val) {
      this.isPinnedLocal = val;
    }
  },
  computed: {
    // contactIndex() {
    //   return contacts.findIndex(contact => contact.id == this.userId);
    // },
    userImg() {
      if (this.contactIndex === -1) {
        return this.$store.state.AppActiveUser.img;
      } else {
        return this.contacts[this.contactIndex].img;
      }
    },
    name() {
      if (this.channelId) {
        return this.$store.state.chat.channels.find(i => {
          return i.id === this.channelId;
        }).name;
      } else {
        return this.$store.state.chat.contacts.find(i => {
          return i.id === this.userId;
        }).email;
      }
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
    }
  },
  methods: {
    getUserStatus(isActiveUser) {
      return isActiveUser
        ? this.$store.state.AppActiveUser.status
        : this.contacts[this.contactIndex].status;
    },
    showSidebar() {
      if (this.channelId) {
        this.$emit("showChannelSidebar", this.channelId);
      }
    }
  },
  mounted() {
    // console.log(this.channelId);
    // console.log(this.$store.state.chat.channels);
  }
};
</script>