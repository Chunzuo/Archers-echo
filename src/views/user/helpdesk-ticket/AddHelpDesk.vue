<template>
  <div id="div-loading" class="vs-con-loading__container">
    <vs-button @click="$router.go(-1)" type="flat" icon="arrow_back">back</vs-button>
    <vx-card>
      <vs-row>
        <vs-col class="mb-4">
          <vs-select
            placeholder="Select Archer"
            class="selectExample"
            label="Selected Archer"
            v-model="ticket.archer"
          >
            <vs-select-item
              :key="index"
              :value="item.value"
              :text="item.text"
              v-for="(item,index) in archers"
            />
          </vs-select>

          <vs-input class="mb-4" label-placeholder="HelpDesk Ticket Name" v-model="ticket.name"></vs-input>
          <quill-editor class="mb-4" id="editor" v-model="ticket.description"></quill-editor>

          <vs-select
            placeholder="Select members"
            class="selectExample w-full"
            label="Assigned Members"
            label-placeholder="Assgiend Members"
            multiple
            autocomplete
            v-model="ticket.assignTo"
          >
            <vs-select-item
              :key="index"
              :value="item.value"
              :text="item.text"
              v-for="(item,index) in teamMembers"
            />
          </vs-select>
        </vs-col>
        <vs-col vs-type="flex">
          <vs-button @click="save" :disabled="!validateForm">Save</vs-button>
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
import archerApi from "@/api/archer";
import io from "socket.io-client";
import { SERVER_URL } from "@/utils/constant";

export default {
  data() {
    return {
      userId: JSON.parse(localStorage.getItem("userInfo")).id,
      ticket: {
        name: "",
        description: "",
        creator: JSON.parse(localStorage.getItem("userInfo")).id,
        assignTo: [],
        archer: null,
        email: JSON.parse(localStorage.getItem("userInfo")).email
      },
      teamMembers: [],
      archers: [],
      resCount: 0,
      socket: io(SERVER_URL),
      socketResponse: false
    };
  },
  components: {
    quillEditor
  },
  mounted() {
    this.getMyTeamMembers();
    this.getArchers();
  },
  methods: {
    async getMyTeamMembers() {
      this.$vs.loading({ container: "#div-loading" });
      try {
        const teamMembers = await teamApi.getMemberList(this.userId);
        for (const member of teamMembers) {
          if (!member.id) continue;
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
      if (++this.resCount === 2) {
        this.$vs.loading.close("#div-loading > .con-vs-loading");
      }
    },
    async save() {
      this.$vs.loading({ container: "#div-loading" });
      this.$socket.emit("REQ_ADD_HELPDESK", this.ticket);
      this.checkResponseSocket();
    },
    async getArchers() {
      this.$vs.loading({ container: "#div-loading" });
      try {
        const archers = await archerApi.list(this.userId);
        for (const archer of archers) {
          this.archers.push({
            value: archer._id,
            text: archer.name
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
      if (++this.resCount === 2) {
        this.$vs.loading.close("#div-loading > .con-vs-loading");
      }
    },
    resetForm() {
      this.ticket = {
        name: "",
        description: "",
        creator: JSON.parse(localStorage.getItem("userInfo")).id,
        assignTo: [],
        archer: null
      };
    },
    checkResponseSocket() {
      setTimeout(() => {
        if (!this.socketResponse) {
          this.$vs.notify({
            title: "Error",
            text: "No response from websocket",
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger"
          });
          this.$vs.loading.close("#div-loading > .con-vs-loading");
        }
      }, 1000 * 10);
    }
  },
  computed: {
    validateForm() {
      return (
        this.ticket.name !== "" &&
        this.ticket.archer !== null &&
        this.ticket.description !== "" &&
        this.ticket.assignTo.length > 0
      );
    }
  },
  socket: {
    events: {
      RES_ADD_HELPDESK(response) {
        this.socketResponse = true;
        const { error } = response;
        if (error) {
          this.$vs.notify({
            title: "Error",
            text: error.message,
            iconPack: "feather",
            icon: "icon-alert-circle",
            color: "danger"
          });
        } else {
          this.$vs.notify({
            color: "success",
            title: "Success",
            text: "Success in add HelpDesk Ticket"
          });
        }
        this.$vs.loading.close("#div-loading > .con-vs-loading");
        this.resetForm();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>