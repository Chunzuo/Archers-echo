<template>
  <div id="div-loading" class="vs-con-loading__container">
    <vs-button @click="$router.go(-1)" type="flat" icon="arrow_back">back</vs-button>
    <vx-card v-if="ticket">
      <vs-row>
        <vs-col>
          <span>Creator:</span>
          <span class="ml-2 font-semibold">{{ticket.openedBy.email}}</span>
        </vs-col>
        <vs-col>
          <span>Ticket name:</span>
          <span class="ml-2 font-semibold">{{ticket.name}}</span>
        </vs-col>
        <vs-col>
          <span>Status:</span>
          <span class="ml-2 font-semibold">{{getStatusLabel(ticket.status)}}</span>
        </vs-col>
        <vs-col>
          <span>Opened at:</span>
          <span class="ml-2 font-semibold">{{ticket.createdAt.replace("T", " ").split(".")[0]}}</span>
        </vs-col>
        <vs-col>
          <vs-list-header title="Assigned Members" color="danger"></vs-list-header>

          <vs-list-item v-for="(item, index) in ticket.assignedTo" :title="item.email" :key="index">
            <template slot="avatar">
              <vs-avatar/>
            </template>
          </vs-list-item>
        </vs-col>
        <vs-divider>Description</vs-divider>
        <vs-col>
          <div v-html="ticket.description"></div>
        </vs-col>
        <vs-divider>Note</vs-divider>
        <vs-col>
          <div v-html="ticket.note"></div>
        </vs-col>
      </vs-row>
    </vx-card>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
import helpDeskApi from "@/api/helpDesk";

export default {
  data() {
    return {
      id: this.$route.params.id,
      ticket: null,
      userId: JSON.parse(localStorage.getItem("userInfo")).id
    };
  },
  components: {
    quillEditor
  },
  mounted() {
    this.getTicketInfo();
  },
  methods: {
    async getTicketInfo() {
      this.$vs.loading({ container: "#div-loading" });
      this.ticket = await helpDeskApi.getInfo(this.id);
      this.$vs.loading.close("#div-loading > .con-vs-loading");
    },
    async update() {
      await helpDeskApi.update(this.id, this.ticket);
      this.$vs.notify({
        color: "success",
        title: "Success",
        text: "Success in update HelpDeskTicket"
      });
    },
    getStatusLabel(status) {
      switch (status) {
        case 0:
          return "Open";
        case 1:
          return "In Progress";
        case 2:
          return "Waiting";
        case 3:
          return "Stopped";
        case 4:
          return "Done";
      }
      return "";
    }
  }
};
</script>

<style lang="scss" scoped>
</style>