<!-- =========================================================================================
	File Name: TheNavbar.vue
	Description: Navbar component
	Component Name: TheNavbar
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Version: 1.1
	Author: Pixinvent
	Author URL: hhttp://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="relative">
    <div class="vx-navbar-wrapper">
      <vs-navbar class="vx-navbar navbar-custom" :color="navbarColor" :class="classObj">
        <!-- SM - OPEN SIDEBAR BUTTON -->
        <feather-icon
          class="sm:inline-flex xl:hidden cursor-pointer mr-1"
          icon="MenuIcon"
          @click.stop="showSidebar"
        ></feather-icon>

        <vs-spacer></vs-spacer>

        <!-- NOTIFICATIONS -->
        <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
          <feather-icon
            icon="BellIcon"
            class="cursor-pointer mt-1 sm:mr-6 mr-2"
            :badge="notifications.length"
          ></feather-icon>
          <vs-dropdown-menu class="notification-dropdown dropdown-custom">
            <div class="notification-top text-center p-5 bg-primary text-white">
              <h3 class="text-white">{{ notifications.length }} New</h3>
              <p class="opacity-75">App Notifications</p>
            </div>

            <VuePerfectScrollbar
              ref="mainSidebarPs"
              class="scroll-area--nofications-dropdown p-0 mb-10"
              :settings="settings"
            >
              <ul class="bordered-items">
                <li
                  v-for="ntf in notifications"
                  :key="ntf.index"
                  class="flex justify-between px-4 py-4 notification cursor-pointer"
                >
                  <div class="flex items-start">
                    <feather-icon
                      :icon="ntf.icon"
                      :svgClasses="[`text-${ntf.category}`, 'stroke-current mr-1 h-6 w-6']"
                    ></feather-icon>
                    <div class="mx-2">
                      <span
                        class="font-medium block notification-title"
                        :class="[`text-${ntf.category}`]"
                      >{{ ntf.title }}</span>
                      <small>{{ ntf.msg }}</small>
                    </div>
                  </div>
                  <div class="vx-col flex flex-col justify-between">
                    <small class="mt-1 whitespace-no-wrap">{{ elapsedTime(ntf.time) }}</small>
                    <small class="text-danger" @click.stop="removeNotification(ntf)">remove</small>
                  </div>
                </li>
              </ul>
            </VuePerfectScrollbar>
            <div
              class="checkout-footer fixed pin-b rounded-b-lg text-primary w-full p-2 font-semibold text-center border border-b-0 border-l-0 border-r-0 border-solid border-grey-light cursor-pointer"
            >
              <span @click="$router.push({path: '/admin/notification'})">View All Notifications</span>
            </div>
          </vs-dropdown-menu>
        </vs-dropdown>

        <!-- SEARCHBAR -->
        <div
          class="search-full-container w-full h-full absolute pin-l rounded-lg"
          :class="{'flex': showFullSearch}"
          v-show="showFullSearch"
        >
          <vx-auto-suggest
            :autoFocus="showFullSearch"
            :data="navbarSearchAndPinList"
            @selected="selected"
            ref="navbarSearch"
            @closeSearchbar="showFullSearch = false"
            placeholder="Search..."
            class="w-full"
            inputClassses="w-full input-no-border no-icon-border"
            icon="SearchIcon"
            background-overlay
          ></vx-auto-suggest>
          <div class="absolute pin-r h-full z-50">
            <feather-icon
              icon="XIcon"
              class="px-4 cursor-pointer h-full close-search-icon"
              @click="showFullSearch = false"
            ></feather-icon>
          </div>
        </div>
        <feather-icon icon="SearchIcon" @click="showFullSearch = true" class="cursor-pointer"></feather-icon>

        <!-- USER META -->
        <div class="the-navbar__user-meta flex items-center sm:ml-5 ml-2">
          <div class="text-right leading-tight hidden sm:block">
            <!-- <p class="font-semibold">{{userEmail}}</p> -->
            <p class="font-semibold">Archersecho Admin</p>
            <small>Available</small>
          </div>
          <vs-dropdown vs-custom-content vs-trigger-click>
            <div class="con-img ml-3">
              <img
                v-if="activeUserImg.startsWith('http')"
                key="onlineImg"
                :src="activeUserImg"
                alt="user-img"
                width="40"
                height="40"
                class="rounded-full shadow-md cursor-pointer block"
              >
              <img
                v-else
                key="localImg"
                :src="require(`@/assets/images/avatar/${activeUserImg}`)"
                alt="user-img"
                width="40"
                height="40"
                class="rounded-full shadow-md cursor-pointer block"
              >
            </div>
            <vs-dropdown-menu>
              <ul style="min-width: 9rem">
                <!-- <li
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$router.push('/user/profile')"
                >
                  <feather-icon icon="UserIcon" svgClasses="w-4 h-4"></feather-icon>
                  <span class="ml-2">Profile</span>
                </li>-->
                <!-- <li
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$router.push('/apps/email')"
                >
                  <feather-icon icon="MailIcon" svgClasses="w-4 h-4"></feather-icon>
                  <span class="ml-2">Inbox</span>
                </li>
                <li
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$router.push('/apps/todo')"
                >
                  <feather-icon icon="CheckSquareIcon" svgClasses="w-4 h-4"></feather-icon>
                  <span class="ml-2">Tasks</span>
                </li>
                <li
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="$router.push('/apps/chat')"
                >
                  <feather-icon icon="MessageSquareIcon" svgClasses="w-4 h-4"></feather-icon>
                  <span class="ml-2">Chat</span>
                </li>-->
                <vs-divider class="m-1"></vs-divider>
                <li
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click.prevent="logout"
                >
                  <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4"></feather-icon>
                  <span class="ml-2">Logout</span>
                </li>
              </ul>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>
      </vs-navbar>
    </div>
  </div>
</template>

<script>
import VxAutoSuggest from "@/components/vx-auto-suggest/VxAutoSuggest.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import firebase from "firebase/app";
import "firebase/auth";

export default {
  name: "the-navbar",
  props: {
    navbarColor: {
      type: String,
      default: "#fff"
    }
  },
  data() {
    return {
      navbarSearchAndPinList: this.$store.state.adminNavbarSearchAndPinList,
      searchQuery: "",
      showFullSearch: false,
      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      },
      autoFocusSearch: false,
      showBookmarkPagesDropdown: false,
      profile: {},
      downloadUrl: "",
      timer: null
    };
  },
  watch: {
    $route() {
      if (this.showBookmarkPagesDropdown)
        this.showBookmarkPagesDropdown = false;
    }
  },
  computed: {
    data() {
      return this.$store.state.adminNavbarSearchAndPinList;
    },
    activeUserInfo() {
      return this.$store.state.AppActiveUser;
    },
    sidebarWidth() {
      return this.$store.state.sidebarWidth;
    },
    breakpoint() {
      return this.$store.state.breakpoint;
    },
    classObj() {
      if (this.sidebarWidth == "default") return "navbar-default";
      else if (this.sidebarWidth == "reduced") return "navbar-reduced";
      else if (this.sidebarWidth) return "navbar-full";
    },
    starredPages() {
      return this.$store.getters.starredPages;
    },
    starredPagesLimited() {
      return this.starredPages.slice(0, 10);
    },
    starredPagesMore() {
      return this.starredPages.slice(10);
    },
    userEmail() {
      return JSON.parse(localStorage.getItem("userInfo")).email;
    },
    activeUserImg() {
      return (
        JSON.parse(localStorage.getItem("userInfo")).photoURL || "default.png"
      );
    },
    notifications() {
      return this.$store.getters["notification/adminNotificationList"];
    }
  },
  methods: {
    showSidebar() {
      this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", true);
    },
    selected(item) {
      console.log(item.url);
      this.$router.push(item.url);
      // this.showFullSearch = false;
    },
    actionClicked(item) {
      // e.stopPropogation();
      this.$store.dispatch("updateStarredPage", {
        index: item.index,
        val: !item.highlightAction
      });
    },
    showNavbarSearch() {
      this.showFullSearch = true;
    },
    showSearchbar() {
      this.showFullSearch = true;
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
    test() {
      alert();
    },
    outside: function() {
      this.showBookmarkPagesDropdown = false;
    },
    logout() {
      // if user is looged in via firebase
      const firebaseCurrentUser = firebase.auth().currentUser;

      if (firebaseCurrentUser) {
        firebase
          .auth()
          .signOut()
          .then(() => {
            this.$router.push("/login");
            localStorage.removeItem("userInfo");
          });
      }

      localStorage.removeItem("userRole");
    },
    handleLoginEvent(data) {
      this.profile = data.profile;
    },
    removeNotification(item) {
      item["notify"] = this.$vs.notify;
      this.$store.dispatch("notification/removeAdminNotification", item);
    }
  },
  directives: {
    "click-outside": {
      bind: function(el, binding) {
        const bubble = binding.modifiers.bubble;
        const handler = e => {
          if (bubble || (!el.contains(e.target) && el !== e.target)) {
            binding.value(e);
          }
        };
        el.__vueClickOutside__ = handler;
        document.addEventListener("click", handler);
      },

      unbind: function(el) {
        document.removeEventListener("click", el.__vueClickOutside__);
        el.__vueClickOutside__ = null;
      }
    }
  },
  components: {
    VxAutoSuggest,
    VuePerfectScrollbar
  },
  mounted() {
    this.$store.dispatch("notification/getAdminNotificationList");
    this.timer = setInterval(() => {
      this.$store.dispatch("notification/getAdminNotificationList");
    }, 1000 * 10);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>