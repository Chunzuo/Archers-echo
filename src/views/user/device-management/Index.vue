<template>
  <div id="todo-app" class="vs-con-loading__container">
    <div class="content-area__content">
      <div class="border border-solid border-grey-light rounded relative overflow-hidden">
        <vs-sidebar
          class="items-no-padding"
          :click-not-close="clickNotClose"
          :hidden-background="clickNotClose"
          v-model="isSidebarActive"
        >
          <add-device :archerId="archerId"></add-device>
          <device-category></device-category>
        </vs-sidebar>
        <div
          :class="{'sidebar-spacer': clickNotClose}"
          class="app-fixed-height border border-r-0 border-b-0 border-t-0 border-solid border-grey-light app-fixed-height"
        >
          <div
            class="flex items-center app-search-container border border-l-0 border-r-0 border-t-0 border-solid border-grey-light"
          >
            <!-- TOGGLE SIDEBAR BUTTON -->
            <feather-icon
              class="md:inline-flex lg:hidden ml-8 mr-4 cursor-pointer"
              icon="MenuIcon"
              @click.stop="toggleTodoSidebar(true)"
            ></feather-icon>

            <!-- SEARCH BAR -->
            <vs-input
              size="large"
              icon-pack="feather"
              icon="icon-search"
              placeholder="Search..."
              @input="onSearchDevice"
              v-model="searchQuery"
              class="input-no-border no-icon-border w-full"
            />
          </div>

          <VuePerfectScrollbar
            class="todo-content-scroll-area"
            :settings="settings"
            ref="todoListPS"
          >
            <transition-group class="todo-list" name="list-enter-up" tag="ul" appear>
              <li
                class="cursor-pointer todo_todo-item"
                v-for="(device, index) in devices"
                :key="device + index"
                :style="[{transitionDelay: (index * 0.1) + 's'}]"
              >
                <device-item :device="device" :archerId="archerId" @showEditPrompt="showEditDialog"></device-item>
              </li>
            </transition-group>
          </VuePerfectScrollbar>
        </div>
      </div>
    </div>
    <device-edit
      :displayPrompt="displayPrompt"
      :device="deviceToEdit"
      @hideEditPrompt="hideEditDialog"
      v-if="displayPrompt"
    ></device-edit>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";

import AddDevice from "./AddDevice.vue";
import DeviceCategory from "./DeviceCategory.vue";
import DeviceItem from "./DeviceItem.vue";
import DeviceEdit from "./DeviceEdit.vue";

export default {
  components: {
    AddDevice,
    VuePerfectScrollbar,
    DeviceCategory,
    DeviceItem,
    DeviceEdit
  },
  data() {
    return {
      archerId: this.$route.params.id,
      isSidebarActive: true,
      clickNotClose: true,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.3
      },
      searchQuery: "",
      select1: [],
      options1: [
        { text: "IT", value: 0 },
        { text: "Blade Runner", value: 2 },
        { text: "Thor Ragnarok", value: 3 }
      ],
      filterDevices: [],
      timer: null,
      displayPrompt: false,
      deviceToEdit: {}
    };
  },
  computed: {
    devices() {
      return this.$store.getters["device/filterDevices"];
    }
  },
  watch: {
    $route() {
      this.archerId = this.$route.params.id
      this.getDeviceList();
    },
    devices() {
      this.$vs.loading.close("#todo-app > .con-vs-loading");
    }
  },
  mounted() {
    this.getDeviceList();
  },
  methods: {
    getDeviceList() {
      this.$vs.loading({
        container: "#todo-app",
        scale: 0.6
      });

      this.$store.commit("device/SET_DEVICE_LIST", []);
      this.$store.dispatch("device/getDevicesByArcherId", this.archerId);
      this.timer = setInterval(() => {
        this.$store.dispatch("device/getDevicesByArcherId", this.archerId);
      }, 1000 * 10);
    },
    setSidebarWidth() {
      if (this.windowWidth < 992) {
        this.isSidebarActive = this.clickNotClose = false;
      } else {
        this.isSidebarActive = this.clickNotClose = true;
      }
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth;
      this.setSidebarWidth();
    },
    onSearchDevice() {
      this.$store.commit("device/SET_FILTER_KEYWORD", this.searchQuery);
    },
    showEditDialog(deviceToEdit) {
      console.log("Show edit dialog");
      // console.log(deviceToEdit);
      this.deviceToEdit = {
        name: deviceToEdit.name,
        type: deviceToEdit.type,
        id: deviceToEdit._id,
        archerId: this.archerId
      };
      this.displayPrompt = true;
    },
    hideEditDialog() {
      this.displayPrompt = false;
    }
  },
  created() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.handleWindowResize);
    });
    this.setSidebarWidth();
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/vuesax/apps/todo.scss";
</style>