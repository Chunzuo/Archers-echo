<template>
  <div class="px-8 py-4 list-item-component" @click="gotoHelpDeskItemDetailPage">
    <div class="vx-row">
      <div class="vx-col w-full sm:w-5/6 flex sm:items-center sm:flex-row flex-col">
        <div class="flex items-center">
          <h6 class="todo-title" :class="{'line-through': isDone}">{{ name }}</h6>
        </div>
        <div class="todo-tags sm:ml-2 sm:my-0 my-2 flex">
          <vs-chip :color="getStatusColor(status)" :class="{'line-through': isDone}">
            <span>{{getStatusLabel(status)}}</span>
          </vs-chip>
        </div>
      </div>
      <div class="vx-col w-full sm:w-1/6 ml-auto flex sm:justify-end">
        <feather-icon
          icon="EditIcon"
          class="cursor-pointer"
          svgClasses="w-5 h-5 mr-4"
          @click.stop="gotoEditPage"
          v-if="isMine"
        ></feather-icon>
        <feather-icon
          icon="TrashIcon"
          class="cursor-pointer"
          svgClasses="w-5 h-5 mr-4"
          @click.stop="confirmDialog"
          v-if="isMine"
        ></feather-icon>
      </div>
    </div>
    <div class="vx-row mt-2">
      <div class="vx-col w-full">
        <vs-chip
          color="primary"
          v-for="(member, index) in members"
          :key="index"
          :class="{'line-through': isDone}"
        >
          <vs-avatar color="primary"></vs-avatar>
          {{member.email}}
        </vs-chip>
      </div>
    </div>
  </div>
</template>

<script>
import helpDeskApi from "@/api/helpDesk";

export default {
  props: ["index"],
  mounted() {},
  computed: {
    helpDeskTicket() {
      return this.$store.getters["helpDeskTicket/ticketList"][this.index];
    },
    name() {
      return this.$store.getters["helpDeskTicket/ticketList"][this.index].name;
    },
    members() {
      return this.$store.getters["helpDeskTicket/ticketList"][this.index]
        .assignedTo;
    },
    status() {
      return this.$store.getters["helpDeskTicket/ticketList"][this.index]
        .status;
    },
    isDone: {
      get() {
        return (
          this.$store.getters["helpDeskTicket/ticketList"][this.index]
            .status === 3
        );
      }
    },
    ticketId() {
      return this.$store.getters["helpDeskTicket/ticketList"][this.index]._id;
    },
    isMine() {
      const userId = JSON.parse(localStorage.getItem("userInfo")).id;
      const ticketCreator = this.$store.getters["helpDeskTicket/ticketList"][
        this.index
      ].openedBy;
      return userId === ticketCreator;
    }
  },
  methods: {
    getStatusLabel(status) {
      switch (status) {
        case 0:
          return "Open";
        case 1:
          return "In Progress";
        case 2:
          return "Waiting";
        case 3:
          return "Done";
      }
      return "";
    },
    gotoHelpDeskItemDetailPage() {
      this.$router.push({
        path: `/user/helpdesk-ticket/detail/${this.ticketId}`
      });
    },
    gotoEditPage() {
      this.$router.push({
        path: `/user/helpdesk-ticket/edit/${this.ticketId}`
      });
    },
    confirmDialog() {
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm`,
        text: "Are you sure delete this ticket?",
        accept: this.deleteTicket
      });
    },
    async deleteTicket() {
      try {
        await helpDeskApi.removeTicket(this.ticketId);
        this.$vs.notify({
          title: "Success",
          text: "Success in delete ticket",
          iconPack: "feather",
          icon: "icon-check",
          color: "success"
        });
      } catch (error) {
        this.$vs.notify({
          title: "Error",
          text: error.message,
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "danger"
        });
      }
      this.$emit("getTicketList");
    },
    getStatusColor(status) {
      switch (status) {
        case 0:
          return "primary";
        case 1:
          return "success";
        case 2:
          return "danger";
        case 3:
          return "warning";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>