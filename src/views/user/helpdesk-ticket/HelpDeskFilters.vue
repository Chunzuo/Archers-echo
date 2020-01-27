<!-- =========================================================================================
    File Name: TodoAddNew.vue
    Description: Add new todo component
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="todo__filters-container">
    <!-- all -->
    <div class="px-6 py-4">
      <div
        class="flex cursor-pointer"
        :class="{'text-primary': todoFilter === -1}"
        @click="applyTodoFilter(-1)"
      >
        <feather-icon
          icon="MailIcon"
          :svgClasses="[{'text-primary stroke-current': todoFilter === -1}, 'h-6 w-6']"
        ></feather-icon>
        <span class="text-lg ml-3">All</span>
      </div>
    </div>

    <vs-divider></vs-divider>

    <!-- starred -->
    <div class="px-6 py-4">
      <h5>Filters</h5>

      <template v-for="filter in todoFilters">
        <div
          class="flex mt-6 cursor-pointer"
          :class="{'text-primary': todoFilter == filter.filter}"
          @click="applyTodoFilter(filter.filter)"
          :key="filter.filter"
        >
          <feather-icon
            :icon="filter.icon"
            :svgClasses="[{'text-primary stroke-current': todoFilter === filter.filter}, 'h-6 w-6']"
          ></feather-icon>
          <span class="text-lg ml-3">{{ filter.filterName }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      todoFilters: [
        { filterName: "Open", filter: 0, icon: "BookOpenIcon" },
        { filterName: "Inprogress", filter: 1, icon: "InfoIcon" },
        { filterName: "Waiting", filter: 2, icon: "StopCircleIcon" },
        { filterName: "Done", filter: 3, icon: "CheckCircleIcon" }
      ]
    };
  },
  computed: {
    todoTags() {
      return this.$store.state.todo.todoTags;
    },
    todoFilter() {
      return this.$store.state.helpDeskTicket.filter.status;
    }
  },
  methods: {
    applyTodoFilter(filterStatus) {
      this.$store.commit("helpDeskTicket/SET_FILTER_STATUS", filterStatus);
      // this.$store.dispatch("todo/applyTodoFilter", filterName);
      this.$emit("closeSidebar", false);
    }
  }
};
</script>