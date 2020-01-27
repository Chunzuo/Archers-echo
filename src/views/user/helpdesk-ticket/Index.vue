<!-- =========================================================================================
    File Name: Todo.vue
    Description: Todo Application to keep you ahead of time
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div
    id="todo-app"
    class="border border-solid border-grey-light rounded relative overflow-hidden vs-con-loading__container"
  >
    <vs-sidebar
      class="items-no-padding"
      parent="#todo-app"
      :click-not-close="clickNotClose"
      :hidden-background="clickNotClose"
      v-model="isSidebarActive"
    >
      <div class="px-6 pb-2 pt-6">
        <vs-button
          class="w-full"
          @click="$router.push({path: '/user/add-helpdesk-ticket'})"
        >Add ticket</vs-button>
      </div>

      <VuePerfectScrollbar class="todo-scroll-area" :settings="settings">
        <help-desk-filters @closeSidebar="toggleTodoSidebar"></help-desk-filters>
      </VuePerfectScrollbar>
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
          v-model="searchQuery"
          @input="onSearchTicket"
          class="vs-input-no-border vs-input-no-shdow-focus no-icon-border w-full"
        />
      </div>

      <!-- TODO LIST -->
      <VuePerfectScrollbar class="todo-content-scroll-area" :settings="settings" ref="todoListPS">
        <transition-group class="todo-list" name="list-enter-up" tag="ul" appear>
          <li
            class="cursor-pointer todo_todo-item"
            v-for="(ticket, index) in helpDeskTicketList"
            :key="String(ticket) + String(index)"
            :style="[{transitionDelay: (index * 0.1) + 's'}]"
          >
            <help-desk-item :index="index" @getTicketList="getTicketList"></help-desk-item>
          </li>
        </transition-group>
      </VuePerfectScrollbar>
      <!-- /TODO LIST -->
    </div>

    <!-- EDIT TODO DIALOG -->
    <todo-edit
      :displayPrompt="displayPrompt"
      :todoItemId="todoIdToEdit"
      @hideDisplayPrompt="hidePrompt"
      v-if="displayPrompt"
    ></todo-edit>
  </div>
</template>

<script>
import HelpDeskFilters from "./HelpDeskFilters.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import HelpDeskItem from "./HelpDeskItem.vue";

export default {
  data() {
    return {
      clickNotClose: true,
      displayPrompt: false,
      todoIdToEdit: 0,
      isSidebarActive: true,
      windowWidth: window.innerWidth,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.3
      },
      searchQuery: ""
    };
  },
  watch: {
    todoFilter() {
      this.$refs.todoListPS.$el.scrollTop = 0;
    },
    helpDeskTicketList() {
      this.$vs.loading.close("#todo-app > .con-vs-loading");
    }
  },
  computed: {
    todo() {
      return this.$store.state.todo.todoArray;
    },
    todoFilter() {
      return this.$store.state.todo.todoFilter;
    },
    todoList() {
      return this.$store.getters["todo/todoList"];
    },
    helpDeskTicketList() {
      return this.$store.getters["helpDeskTicket/ticketList"];
    },
    userId() {
      return JSON.parse(localStorage.getItem("userInfo")).id;
    }
  },
  methods: {
    showDisplayPrompt(itemId) {
      this.todoIdToEdit = itemId;
      this.displayPrompt = true;
    },
    hidePrompt() {
      this.displayPrompt = false;
    },
    handleWindowResize(event) {
      this.windowWidth = event.currentTarget.innerWidth;
      this.setSidebarWidth();
    },
    setSidebarWidth() {
      if (this.windowWidth < 992) {
        this.isSidebarActive = this.clickNotClose = false;
      } else {
        this.isSidebarActive = this.clickNotClose = true;
      }
    },
    toggleTodoSidebar(value = false) {
      if (!value && this.clickNotClose) return;
      this.isSidebarActive = value;
    },
    getTicketList() {
      this.$vs.loading({ container: "#todo-app" });
      this.$store.dispatch("helpDeskTicket/getHelpDeskTicketList", this.userId);
    },
    onSearchTicket() {
      this.$store.commit("helpDeskTicket/SET_FILTER_KEYWORD", this.searchQuery);
    }
  },
  components: {
    HelpDeskFilters,
    VuePerfectScrollbar,
    HelpDeskItem
  },
  created() {
    this.$nextTick(() => {
      window.addEventListener("resize", this.handleWindowResize);
    });
    this.setSidebarWidth();
  },
  beforeDestroy: function() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
  mounted() {
    this.getTicketList();
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/vuesax/apps/todo.scss";
</style>