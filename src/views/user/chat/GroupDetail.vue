<!-- =========================================================================================
    File Name: UserProfile.vue
    Description: user profile sidebar
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="parentx-demo-2" v-if="channelId">
    <vs-sidebar
      parent="#chat-app"
      :position-right="true"
      :hidden-background="false"
      v-model="activeLocal"
      id="chat-profile-sidebar"
      class="items-no-padding"
    >
      <div class="header-sidebar relative flex flex-col p-0" slot="header">
        <feather-icon
          icon="XIcon"
          svgClasses="m-2 cursor-pointer absolute pin-t pin-r"
          @click="$emit('closeChannelSidebar', false)"
        ></feather-icon>

        <div class="relative inline-flex mx-auto mb-5 mt-6">
          <vs-avatar class="m-0" icon-pack="feather" icon="icon-users" size="70px"/>
        </div>
        <h4 class="mr-2 self-center">{{ channelName }}</h4>
      </div>

      <VuePerfectScrollbar class="scroll-area" :settings="settings">
        <div class="p-8">
          <vs-divider>Description</vs-divider>
          <div v-html="channelDescription"></div>

          <vs-divider>Members</vs-divider>
          <vs-row>
            <vs-col v-for="(member, index) in channelMembers" :key="index">
              <div class="relative inline-flex mx-auto mb-5 mt-6">
                {{member.email}}
                <vs-avatar class="m-0" icon-pack="feather" icon="icon-user" size="40px"/>
                <div
                  class="h-5 w-5 border-white border-2 border-solid rounded-full absolute pin-r pin-b"
                  :class="'bg-' + getStatusColor1(member.status)"
                ></div>
              </div>
            </vs-col>
          </vs-row>
        </div>
      </VuePerfectScrollbar>
    </vs-sidebar>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import contacts from "./contacts.js";

export default {
  props: ["channelId", "active"],
  data() {
    return {
      contacts: contacts,
      counterDanger: false,
      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      }
    };
  },
  computed: {
    isActiveUser() {
      return this.contactIndex === -1;
    },
    activeLocal: {
      get() {
        return this.active;
      },
      set(value) {
        this.$emit("closeChannelSidebar", value);
      }
    },
    about: {
      get() {
        if (this.contactIndex === -1) {
          return this.$store.state.AppActiveUser.about;
        } else {
          return this.contacts[this.contactIndex].about;
        }
      },
      set(value) {
        if (value.length > 120) {
          value = value.substring(0, 120);
        }
        this.$store.dispatch("chat/updateAboutChat", value);
      }
    },
    contactIndex() {
      return contacts.findIndex(contact => contact.id == this.userId);
    },
    status: {
      get() {
        if (this.contactIndex === -1) {
          return this.$store.state.AppActiveUser.status;
        }
      },
      set(value) {
        if (this.contactIndex === -1) {
          this.$store.dispatch("chat/updateStatusChat", value);
        }
      }
    },
    userImg() {
      if (this.contactIndex === -1) {
        return this.$store.state.AppActiveUser.img;
      } else {
        return this.contacts[this.contactIndex].img;
      }
    },
    userName() {
      if (this.contactIndex === -1) {
        return this.$store.state.AppActiveUser.name;
      } else {
        return this.contacts[this.contactIndex].name;
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
    },
    getStatusColor1() {
      return status => {
        if (status === 1) {
          return "success";
        } else if (status === 2) {
          return "danger";
        }
      };
    },
    channelName() {
      // console.log(this.$store.state.chat.channels);
      // console.log(this.channelId);
      return this.$store.state.chat.channels.find(i => {
        return i.id === this.channelId;
      }).name;
    },
    channelDescription() {
      // console.log("channelDescription");
      // console.log(
      //   this.$store.state.chat.channels.find(i => {
      //     return i.id === this.channelId;
      //   })
      // );
      return this.$store.state.chat.channels.find(i => {
        return i.id === this.channelId;
      }).description;
    },
    channelMembers() {
      return this.$store.state.chat.channels.find(i => {
        return i.id === this.channelId;
      }).members;
    }
  },
  methods: {
    getUserStatus(isActiveUser) {
      return isActiveUser
        ? this.$store.state.AppActiveUser.status
        : this.contacts[this.contactIndex].status;
    }
  },
  components: {
    VuePerfectScrollbar
  }
};
</script>