<!-- =========================================================================================
	File Name: VxSidebar.vue
	Description: Sidebar Component
	Component Name: VxSidebar
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Version: 1.1
	Author: Pixinvent
	Author URL: hhttp://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template lang="html">
	<div class="parentx">
		<vs-sidebar ref="mainSidebar" :parent="parent" :hiddenBackground="true" :reduce="reduce" default-index="-1" class="sidebarx main-menu-sidebar items-no-padding" v-model="isSidebarActive" :click-not-close="clickNotClose" :reduce-not-rebound="reduceNotRebound">
			<div @mouseenter="sidebarMouseEntered" @mouseleave="sidebarMouseLeave">
				<div class="header-sidebar flex items-end justify-between" slot="header">
					<div class="logo flex items-center">
						<img :src="logo" alt="logo" class="w-10 mr-4" v-if="logo">
						<span class="logo-text" v-show="isMouseEnter || !reduce" v-if="title">{{ title }}</span>
					</div>
					<div>
						<template v-if="showCloseButton">
							<feather-icon icon="XIcon" class="m-0 cursor-pointer" @click="$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', false)"></feather-icon>
						</template>
						<template v-else-if="!showCloseButton && !sidebarItemsMin">
  <feather-icon
    icon="DiscIcon"
    class="mr-0 cursor-pointer"
    svg-classes="stroke-current"
    v-show="!reduce"
    @click="toggleReduce(true)"
  ></feather-icon>
  <feather-icon
    icon="CircleIcon"
    class="mr-0 cursor-pointer"
    svg-classes="stroke-current"
    v-show="reduce"
    @click="toggleReduce(false)"
  ></feather-icon>
</template>
					</div>
				</div>

				<div class="shadow-bottom" v-show="showShadowBottom"></div>

				<VuePerfectScrollbar ref="mainSidebarPs" class="scroll-area--main-sidebar pt-2" :settings="settings" @ps-scroll-y="psSectionScroll">
					<template v-for="(sidebarItem, index) in sidebarItems">
  <!-- GROUP ITEM HEADER -->
  <span
    :key="`header-${index}`"
    v-if="sidebarItem.header && !sidebarItemsMin"
    class="navigation-header truncate"
  >{{ sidebarItem.header }}</span>
  <template v-else-if="!sidebarItem.header">
    <!-- IF IT'S SINGLE ITEM -->
    <vx-sidebar-item
      ref="sidebarLink"
      :key="`sidebarItem-${index}`"
      v-if="!sidebarItem.submenu"
      :index="index"
      :to="sidebarItem.slug != 'external' ? sidebarItem.url : ''"
      :href="sidebarItem.slug == 'external' ? sidebarItem.url : ''"
      :icon="sidebarItem.icon"
      :target="sidebarItem.target"
      :isDisabled="sidebarItem.isDisabled"
    >
      <span v-show="!sidebarItemsMin" class="truncate">{{ sidebarItem.name }}</span>
      <vs-chip
        class="ml-auto"
        :color="sidebarItem.tagColor"
        v-if="sidebarItem.tag && (isMouseEnter || !reduce)"
      >{{ sidebarItem.tag }}</vs-chip>
    </vx-sidebar-item>

    <!-- IF HAVE SUBMENU / DROPDOWN -->
    <template v-else>
      <vx-sidebar-group
        ref="sidebarGrp"
        :key="`group-${index}`"
        :openHover="openGroupHover"
        :group="sidebarItem"
        :groupIndex="index"
        :open="isGroupActive(sidebarItem)"
      ></vx-sidebar-group>
    </template>
  </template>
</template>
				</VuePerfectScrollbar>
			</div>
		</vs-sidebar>
	</div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";

import VxSidebarGroup from "./VxSidebarGroup.vue";
import VxSidebarItem from "./VxSidebarItem.vue";
import adminSidebarItems from "./adminSidebarItems";

export default {
  name: "vx-sidebar",
  props: {
    title: {
      type: String
    },
    logo: {
      type: String
    },
    parent: {
      type: String
    },
    openGroupHover: {
      type: Boolean,
      default: false
    },
    reduceNotRebound: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    clickNotClose: false, // disable close sidebar on outside click
    reduce: false, // determines if sidebar is reduce - component property
    showCloseButton: false, // show close button in smaller devices
    isMouseEnter: false,
    settings: {
      // perfectscrollbar settings
      maxScrollbarLength: 60,
      wheelSpeed: 1,
      swipeEasing: true
    },
    windowWidth: window.innerWidth, //width of windows
    showShadowBottom: false,
    user: {}
  }),
  computed: {
    isSidebarActive: {
      get() {
        return this.$store.state.isSidebarActive;
      },
      set() {}
    },
    reduceSidebar() {
      return Boolean(this.reduce && this.reduceButton);
    },
    reduceButton: {
      get() {
        return this.$store.state.themeConfig.sidebarCollapsed;
      },
      set(val) {
        this.$store.commit("themeConfig/TOGGLE_REDUCE_BUTTON", val);
      }
    },
    sidebarItemsMin() {
      return this.$store.state.sidebarItemsMin;
    },
    isGroupActive() {
      return sidebarItem => {
        const path = this.$route.fullPath;
        let open = false;
        let func = function(sidebarItem) {
          if (sidebarItem.submenu) {
            sidebarItem.submenu.forEach(item => {
              if (path == item.url) {
                open = true;
              } else if (item.submenu) {
                func(item);
              }
            });
          }
        };
        func(sidebarItem);
        return open;
      };
    },
    sidebarItems() {
      if (parseInt(localStorage.getItem("userRole")) === 1) {
        return adminSidebarItems;
      }

      let unreadMessages = 0;
      this.$store.state.notification.userNotifications.forEach(notification => {
        if (notification.category === 2) {
          unreadMessages += 1;
        }
      });

      let items = [
        {
          url: "/user/home",
          name: "Home",
          icon: "HomeIcon"
        },
        {
          url: "/user/team-management",
          name: "Team Management",
          icon: "UsersIcon"
        },
        {
          url: "/user/helpdesk-ticket",
          name: "HelpDesk Ticket",
          icon: "Share2Icon"
        },
        {
          url: "/user/add-wizard",
          name: "Add Wizard",
          icon: "PackageIcon"
        },
        {
          url: "/user/archer-management",
          name: "Archer Management",
          slug: "archer-management",
          icon: "CloudIcon"
        }
      ];
      unreadMessages > 0
        ? items.push({
            url: "/user/chat",
            name: "Chat",
            slug: "chat",
            icon: "MessageSquareIcon",
            tag: unreadMessages,
            tagColor: "danger"
          })
        : items.push({
            url: "/user/chat",
            name: "Chat",
            slug: "chat",
            icon: "MessageSquareIcon"
          });

      items.push({ header: "Archers" });
      for (const archer of this.$store.state.archer.archers) {
        items.push({
          url: null,
          name: archer.name,
          icon: "AwardIcon",
          id: archer._id,
          submenu: [
            {
              url: "/user/device-management/" + archer._id,
              name: "Devices"
            },
            {
              url: "/user/instance-management/" + archer._id,
              name: "Instances"
            },
            {
              url: "/user/configuration-information/" + archer._id,
              name: "Configuration Information"
            },
            {
              url: "/user/error-logs/" + archer._id,
              name: "Error Logs"
            },
            {
              url: "/user/statistics/" + archer._id,
              name: "Statistics"
            },
            {
              url: "/user/support-ticket/" + archer._id,
              name: "Support Ticket"
            },
            {
              url: "/user/configuration-report/" + archer._id,
              name: "Configuration Report"
            }
          ]
        });
      }
      return items;
      // return parseInt(localStorage.getItem("userRole")) === 1
      //   ? adminSidebarItems
      //   : userSidebarItems;
    }
  },
  watch: {
    reduce(val) {
      if (val == true) {
        this.$store.dispatch("updateSidebarWidth", "reduced");
      } else {
        this.$store.dispatch("updateSidebarWidth", "default");
      }

      setTimeout(function() {
        window.dispatchEvent(new Event("resize"));
      }, 100);
    },
    reduceButton() {
      this.setSidebarWidth();
    },
    $route() {
      if (this.isSidebarActive && this.showCloseButton)
        this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", false);
    }
  },
  methods: {
    sidebarMouseEntered() {
      if (this.reduce) this.$store.commit("UPDATE_SIDEBAR_ITEMS_MIN", false);
      this.isMouseEnter = true;
    },
    sidebarMouseLeave() {
      if (this.reduce) {
        this.$store.commit("UPDATE_SIDEBAR_ITEMS_MIN", true);
      }
      this.isMouseEnter = false;
    },
    toggleReduce(val) {
      this.reduceButton = val;
      this.setSidebarWidth();
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth;
      this.setSidebarWidth();
    },
    setSidebarWidth() {
      if (this.windowWidth < 1200) {
        if (this.windowWidth < 992)
          this.$store.commit("UPDATE_WINDOW_BREAKPOINT", "md");
        else this.$store.commit("UPDATE_WINDOW_BREAKPOINT", "lg");

        this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", false);
        if (this.reduceButton) this.reduce = false;
        // this.reduceButton = false;
        this.showCloseButton = true;
        this.clickNotClose = false;
        this.$store.dispatch("updateSidebarWidth", "no-sidebar");
        this.$store.commit("UPDATE_SIDEBAR_ITEMS_MIN", false);
      } else {
        this.$store.commit("UPDATE_WINDOW_BREAKPOINT", "xl");
        if (this.reduceButton) this.reduce = true;
        else this.reduce = false;

        this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", true);
        if (this.reduceButton && !this.isMouseEnter)
          this.$store.commit("UPDATE_SIDEBAR_ITEMS_MIN", true);
        else this.$store.commit("UPDATE_SIDEBAR_ITEMS_MIN", false);

        this.clickNotClose = true;
        this.showCloseButton = false;
        if (this.reduceSidebar)
          this.$store.dispatch("updateSidebarWidth", "reduced");
        else this.$store.dispatch("updateSidebarWidth", "default");
      }
    },
    psSectionScroll() {
      if (this.$refs.mainSidebarPs.$el.scrollTop > 0)
        this.showShadowBottom = true;
      else this.showShadowBottom = false;
    }
  },
  components: {
    VxSidebarGroup,
    VxSidebarItem,
    VuePerfectScrollbar
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.handleWindowResize);
    });
    this.setSidebarWidth();
    this.$store.dispatch(
      "archer/getArcherList",
      JSON.parse(localStorage.getItem("userInfo")).id
    );
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleWindowResize);
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/vuesax/components/vxSidebar.scss";
</style>