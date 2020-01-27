<template>
  <div id="div-loading" class="vs-con-loading__container">
    <vs-button @click="$router.go(-1)" type="flat" icon="arrow_back">back</vs-button>
    <vx-card>
      <vs-row>
        <vs-col class="mb-4">
          <vs-input class="mb-4" label-placeholder="HelpDesk Ticket Name" v-model="ticket.name"></vs-input>
          <div class="mb-4">
            <span>Status:</span>
            <span class="ml-2 font-semibold">{{getStatusLabel(ticket.status)}}</span>
            <vs-button class="ml-2" v-if="ticket.status === 0" @click="updateStatus(1)">Start</vs-button>
            <vs-button class="ml-2" v-if="ticket.status === 1" @click="updateStatus(2)">Stop</vs-button>
            <vs-button class="ml-2" v-if="ticket.status === 1" @click="updateStatus(3)">Complete</vs-button>
            <vs-button class="ml-2" v-if="ticket.status === 2" @click="updateStatus(1)">Resume</vs-button>
          </div>
          <vs-select
            placeholder="Select members"
            class="selectExample w-full"
            label="Assigned Members"
            label-placeholder="Assgiend Members"
            multiple
            autocomplete
            v-model="ticket.assignedTo"
          >
            <vs-select-item
              :key="index"
              :value="item.value"
              :text="item.text"
              v-for="(item,index) in teamMembers"
            />
          </vs-select>
          <vs-divider>Description</vs-divider>
          <quill-editor class="mb-4" id="editor" v-model="ticket.description"></quill-editor>
          <vs-divider>Note</vs-divider>
          <quill-editor class="mb-4" v-model="ticket.note"></quill-editor>
        </vs-col>
        <vs-col vs-type="flex">
          <vs-button @click="update">Update</vs-button>
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
import teamApi from "@/api/team";
import helpDeskApi from "@/api/helpDesk";

export default {
  data() {
    return {
      id: this.$route.params.id,
      ticket: {
        name: "",
        description: "",
        creator: JSON.parse(localStorage.getItem("userInfo")).id,
        assignedTo: []
      },
      teamMembers: [],
      userId: JSON.parse(localStorage.getItem("userInfo")).id
    };
  },
  components: {
    quillEditor
  },
  methods: {
    async getMyTeamMembers() {
      this.$vs.loading({ container: "#div-loading" });
      try {
        const teamMembers = await teamApi.getMemberList(this.userId);
        for (const member of teamMembers) {
          this.teamMembers.push({
            value: member.id._id,
            text: member.id.email
          });
        }
      } catch (error) {
        this.$vs.notify({
          title: "Error",
          text: error.message,
          iconPack: "feather",
          icon: "icon-alert-circle",
          color: "danger"
        });
      }
      this.$vs.loading.close("#div-loading > .con-vs-loading");

      // console.log(this.teamMembers);
    },
    async getTicketInfo() {
      this.$vs.loading({ container: "#div-loading" });
      this.ticket = await helpDeskApi.getInfo(this.id);
      const { assignedTo } = this.ticket;
      let members = [];
      for (const member of assignedTo) {
        members.push(member._id);
      }
      this.ticket.assignedTo = members;
      console.log(this.ticket);
      this.$vs.loading.close("#div-loading > .con-vs-loading");
    },
    async update() {
      this.$vs.loading({ container: "#div-loading" });
      try {
        await helpDeskApi.update(this.id, this.ticket);
        this.$vs.notify({
          title: "Success",
          text: "Success in update ticket",
          iconPack: "feather",
          icon: "icon-check",
          color: "success"
        });
      } catch (error) {
        this.$vs.notify({
          title: "Error",
          text: error.message,
          iconPack: "feather",
          icon: "icon-laert-circle",
          color: "danger"
        });
      }
      this.$vs.loading.close("#div-loading > .con-vs-loading");
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
          return "Done";
      }
      return "";
    },
    async updateStatus(status) {
      this.$vs.loading({ container: "#div-loading" });
      try {
        await helpDeskApi.updateStatus({ id: this.id, status: status });
        this.$vs.notify({
          title: "Success",
          text: "Success in update status",
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
      this.$vs.loading.close("#div-loading > .con-vs-loading");
      this.getTicketInfo();
    }
  },
  mounted() {
    this.getMyTeamMembers();
    this.getTicketInfo();
  }
};
</script>

<style lang="scss" scoped>
</style>